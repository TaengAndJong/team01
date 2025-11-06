package com.example.team01.admin;


import com.example.team01.admin.service.AdminBookService;
import com.example.team01.category.service.CategoryService;
import com.example.team01.common.exception.BookNotFoundException;
import com.example.team01.utils.FileUtils;
import com.example.team01.utils.Pagination;
import com.example.team01.vo.AdminBookVO;
import com.example.team01.vo.BookVO;
import com.example.team01.vo.CategoryVO;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.util.*;

//컨트롤러는 응답과 결과만 반환함

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/admin/book")
@RestController
public class AdminBookController {

    private final CategoryService categoryService;
    private final AdminBookService bookService;
    private final FileUtils fileUtils;

    @GetMapping("/bookCreate")
    public ResponseEntity<?> getCreateBook(){
        log.info("도서 생성 get API 호출됨");
        //카테고리 목록 가져오기
        Map<String, List<CategoryVO>> cateData  = categoryService.getAllCategories();
        log.info("도서 생성 get API cateData:{}",cateData);
        return  ResponseEntity.ok(cateData);
    }


    @PostMapping(value = "/bookCreate")
    public ResponseEntity<?> insertBookCreate(
            @ModelAttribute AdminBookVO createBook,
            @RequestParam(name = "createDate") String createDate,
            @RequestParam(name = "bookCateNm") List<String> bookCateNm,
            @RequestParam(name = "bookCateDepth") List<String> bookCateDepth,
            @RequestParam(name = "cateId") List<String> cateId,
            @RequestParam(name= "bookImg", required = false) List<MultipartFile> bookImg,HttpServletRequest request) throws FileNotFoundException {


        log.info("createBook-----들어오는 데이터확인하기:{}",createBook);
        log.info("createDate-----들어오는 데이터확인하기:{}",createDate);
        log.info("bookImg-----create",bookImg);
        //배열 리스트로 받아 온 값을 ,를 기준으로 문자열로 합치기 ,==> bookCateDepth=1차 카테고리,2차 카테고리,3차 카테고리,
        createBook.setBookCateNm(String.join(",", bookCateNm));
        createBook.setBookCateDepth(String.join(",", bookCateDepth));
        createBook.setCateId(String.join(",", cateId));

        // bookImg

        // 서비스로 book 정보와 파일을 전달 ( 컨트롤러에서 (비어있어도)파일객체와 기본객체를 분리하지 않고 서비스로 넘겨줌)
        int result = bookService.createBook(createBook);

        // 데이터 insert 성공시 결과 반환
        if (result > 0) {
            AdminBookVO addBookData = bookService.deTailBook(createBook.getBookId());
            //파일 경로 서버주소 반영하는 파일Util
            fileUtils.changeImgPath(addBookData,request);
            return ResponseEntity.ok(addBookData);// 저장된 데이터 전체를 클라이언트에 반환
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Book creation failed");
        }

    }


    @GetMapping("/bookList")
    public ResponseEntity<?>  getBookList( @RequestParam(defaultValue = "1") int currentPage,
                                           @RequestParam(defaultValue = "6") int pageSize
                                            ,HttpServletRequest request){
        log.info("도서 목록 API 호출됨");
        //페이지 계산 클래스 불러오기
        Pagination pagination = new Pagination(currentPage, pageSize); //현재페이지 && 보여줄 페이지 수

        log.info("pagination -----------------: {} pageSize:{}",currentPage,pageSize);
        //서비스로 데이터 넘기기
        List<AdminBookVO> bookList  = bookService.getAllBooks(pagination);

        for (AdminBookVO adminBookVO : bookList) {
            log.info("여기:{}", adminBookVO);

            fileUtils.changeImgPath(adminBookVO,request); // 새로운 이미지주소를 가진  bookVO객체가 반환됨
            log.info("다음:{}", adminBookVO);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("items", bookList);
        result.put("currentPage", pagination.getCurrentPage());
        result.put("pageSize", pagination.getPageSize());
        result.put("totalPages", pagination.getTotalPages());
        result.put("totalRecord", pagination.getTotalRecord());
        log.info("result---get:{}",result);
        // 배열 안에 객체 형태로 내보내려면 원본 Map 사용하지 않고 내보내야함
       return  ResponseEntity.ok(result);
    }

    @PostMapping("/bookList")
    public ResponseEntity<?>  getSearchBookList( @RequestParam(required = false) String bookType,
                                                   @RequestParam(required = false) String searchType,
                                                 @RequestParam String keyword,
                                                 @RequestParam(defaultValue = "1") int page,
                                                 @RequestParam(defaultValue = "6") int pageSize,
                                                 HttpServletRequest request){
            log.info("도서 목록 searchkeyword API 호출됨");
            log.info("bookType --------------------: {}",bookType);
            log.info("searchType -------------------: {}",searchType);
            log.info("keyword -----------------: {}",keyword);
            //페이지 계산 클래스 불러오기
            Pagination pagination = new Pagination(page, pageSize);
            log.info("pagination -----------------: {}",pagination);

            //검색필터 설정해주기
            pagination.addDetailCondition("bookType", bookType);
            pagination.addDetailCondition("searchType", searchType);
            pagination.addDetailCondition("keyword", keyword);

            log.info("DetailContion-----:{}",pagination.getDetailCondition());

            //서비스로 검색 파라미터 넘겨주기
            List<AdminBookVO> bookList = bookService.getAllBooks(pagination);

            // 레코드 순회
            for (AdminBookVO adminBookVO : bookList) {
                log.info("여기--검색 책목록:{}", adminBookVO);

                fileUtils.changeImgPath(adminBookVO,request); // 새로운 이미지주소를 가진  bookVO객체가 반환됨
                log.info("다음--검색 책목록:{}", adminBookVO);
            }

            Map<String, Object> result = new HashMap<>();
            result.put("items", bookList);
            result.put("currentPage", pagination.getCurrentPage());
            result.put("pageSize", pagination.getPageSize());
            result.put("totalPages", pagination.getTotalPages());
            result.put("totalRecord", pagination.getTotalRecord());
            log.info("result -----------------: {}",bookList);
            //응답 반환
            return  ResponseEntity.ok(result);

        }

// 인덱스와 primary key 역할을 겸한다면 long type으로 설정해야 데이터베이스 성능이 좋아짐

    @GetMapping("/bookDetail/{bookId}")
    public ResponseEntity<?> getBookDetail(@PathVariable String bookId,HttpServletRequest request){


        // 아이디를 파라미터로 데이터베이스에 넘겨서 데이터 받아오기
        AdminBookVO adminBookVO = bookService.deTailBook(bookId);

        fileUtils.changeImgPath(adminBookVO,request);
        log.info("adminBookVO -----------:{}",adminBookVO);

        Map<String, Object> response = new HashMap<>();
        response.put("bookVO", adminBookVO);

        return  ResponseEntity.ok(response);
    }

    @GetMapping("/bookModify/{bookId}")
    public ResponseEntity<?>  getBookModify(@PathVariable String bookId,HttpServletRequest request){
        log.info("도서 수정 API 호출됨");

        //카테고리 목록 가져오기
        Map<String, List<CategoryVO>> cateData  = categoryService.getAllCategories();

        //해당 아이디에 대한 도서 정보 가져오기
        AdminBookVO adminBookVO = bookService.deTailBook(bookId);
        fileUtils.changeImgPath(adminBookVO, request); // 필요 시 이미지 경로 수정

        Map<String,Object> response = new HashMap<>();
        //해당 아이디에 대한 도서데이터와 , 카테고리 데이터를 클라이언트에게 전송하기!
        //문자열 데이터 List 형태로 바꿔서 bookVO재설정하기
        // 도서 데이터준비
        response.put("book", adminBookVO);
        //카테고리 데이터
        response.put("cateData",cateData);

        return  ResponseEntity.ok(response);
    }

    @PostMapping("/bookModify/{bookId}")
    public ResponseEntity<?> updateBookModify(
            @ModelAttribute AdminBookVO modifyBook,
            @RequestParam(name = "bookCateNm") List<String> bookCateNm,
            @RequestParam(name = "bookCateDepth") List<String> bookCateDepth,
            @RequestParam(name = "cateId") List<String> cateId,
            @RequestParam(name= "bookImg", required = false) List<MultipartFile> bookImg,
            @RequestParam(name = "removedBookImg", required = false) List<String> removedBookImg,
            HttpServletRequest request) throws FileNotFoundException {

        //배열 리스트로 받아 온 값을 ,를 기준으로 문자열로 합치기 ,==> bookCateDepth=1차 카테고리,2차 카테고리,3차 카테고리,
        modifyBook.setBookCateNm(String.join(",", bookCateNm));
        modifyBook.setBookCateDepth(String.join(",", bookCateDepth));
        modifyBook.setCateId(String.join(",", cateId));


        // 서비스로 book 정보와 파일을 전달 ( 컨트롤러에서 (비어있어도)파일객체와 기본객체를 분리하지 않고 서비스로 넘겨줌)
        int result = bookService.updateBook(modifyBook);


        // 데이터 insert 성공시 결과 반환
        if (result > 0) {
            AdminBookVO updateData = bookService.deTailBook(modifyBook.getBookId());

            //파일 경로 서버주소 반영하는 파일Util
            fileUtils.changeImgPath(updateData,request);
            //삭제된 이미지 목록이 있을 경우에만 실행
            if (removedBookImg != null && !removedBookImg.isEmpty()) {
                fileUtils.deleteFiles(String.join(",", removedBookImg), "book");
            }
            return ResponseEntity.ok(updateData);// 저장된 데이터 전체를 클라이언트에 반환
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Book creation failed");
        }

    }


    @PostMapping("/bookDelete")
    public ResponseEntity<?> deleteBook(@RequestBody List<String> bookIds) {
        //1) 유효성검사  ==> 삭제할 도서 아이디가  데이터베이스에 존재하는지에 대한 여부
        //2) 예외 처리: 도서가 존재하지 않거나 삭제가 불가능한 상태일 경우 예외 던지기
        log.info("삭제할 ID들: :{}",bookIds ); // [1, 2, 3]

        if (bookIds == null || bookIds.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "삭제할 ID가 없습니다."
            ));
        }

        //Advice 미사용 시, 예외에 대해서 try-catch 구문을 사용해서 처리해주기
        try {

            int result = bookService.deleteBooks(bookIds);

            if (result > 0) {
                // 삭제 성공시 데이터 반환
                //전체도서 데이터 조회 후 반환값에 담아주기
                
                //프론트로 반환
                return ResponseEntity.ok(Map.of(
                        "message", "삭제 완료",
                        "deletedCount", result
                ));
            }else{

            }
            return ResponseEntity.ok(Map.of(
                    "message", "삭제 완료",
                    "deletedCount", result
            ));
        } catch (BookNotFoundException ex) {

            // 여기서 예외를 직접 처리!
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "존재하지 않는 도서가 포함되어 있습니다.",
                    "missingIds", ex.getMissingIds(),  // 예외 클래스에서 getter 사용
                    "message", ex.getMessage()
            ));
        }


    }

}

//@ModelAttribute는 formData형태로 넘어올 때 사용하고, 그 외에는 @RequestBody 를 사용해서 Json객체를 Java객체로 맴핑

