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


        //배열 리스트로 받아 온 값을 ,를 기준으로 문자열로 합치기 ,==> bookCateDepth=1차 카테고리,2차 카테고리,3차 카테고리,
        createBook.setBookCateNm(String.join(",", bookCateNm));
        createBook.setBookCateDepth(String.join(",", bookCateDepth));
        createBook.setCateId(String.join(",", cateId));

        // bookImg

        // 서비스로 book 정보와 파일을 전달 ( 컨트롤러에서 (비어있어도)파일객체와 기본객체를 분리하지 않고 서비스로 넘겨줌)
        int result = bookService.createBook(createBook);

        // 데이터 insert 성공시 결과 반환
        if (result > 0) {
            // 디비에 insert 된 후의 도서 Id를 받아와야함

            AdminBookVO addBookData = bookService.deTailBook(createBook.getBookId());
            //파일 경로 서버주소 반영하는 파일Util

            log.info("addBookData --- :{}",addBookData);
            // addBookData 이미지Path를 분리해서 담아줄 ImgliSt 배열 변수 필요
            List<String> imgArray = new ArrayList<>(); // 가변배열 리스트이면서, 값이 없어도 존재해야함 ( npx 방지 )
            if(addBookData.getBookImgPath() != null && !addBookData.getBookImgPath().isEmpty()){
                imgArray =  new ArrayList<>(
                        Arrays.asList(
                                addBookData.getBookImgPath().split(",") //String [] 배열로 반환
                        )//Arrays.asList() 는 배열을 List로 => 고정크기 List
                );// new ArrayList로 수정 가능한 새로운 가변 List 생성

            }
            //for문 종료
            // addBookData bookImgList에 담아주기
            addBookData.setBookImgList(imgArray);
            log.info("addBookData --- :{}",addBookData);

            return ResponseEntity.ok(addBookData);// 저장된 데이터 전체를 클라이언트에 반환
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Book creation failed");
        }

    }


    @GetMapping("/bookList")
    public ResponseEntity<?>  getBookList( @RequestParam(defaultValue = "1") int currentPage,
                                           @RequestParam(defaultValue = "6") int pageSize,

                                           @RequestParam(required = false) String bookType,
                                           @RequestParam(required = false) String searchType,
                                           @RequestParam(required = false) String keyword
                                            ,HttpServletRequest request){
        log.info("도서 목록 API 호출됨 ------ getbookList");
        log.info("도서 목록 currentPage : {} ,pageSize:{},bookType:{} ,searchType:{},keyword:{}",currentPage,pageSize,bookType,searchType,keyword);
        //페이지 계산 클래스 불러오기
        Pagination pagination = new Pagination(currentPage, pageSize); //현재페이지 && 보여줄 페이지 수

        //검색조건이 있을 경우
        if (keyword != null && !keyword.isBlank()) {
            log.info("검색키워드 없음 미진입 keword : {} ",keyword);
            pagination.addDetailCondition("bookType", bookType);
            pagination.addDetailCondition("searchType", searchType);
            pagination.addDetailCondition("keyword", keyword);
            log.info("pagination.addDetailCondition:{}",pagination.getDetailCondition());
        }

        log.info("pagination -----------------: {} pageSize:{}",currentPage,pageSize);
        //서비스로 데이터 넘기기
        List<AdminBookVO> bookList  = bookService.getAllBooks(pagination);

        for (AdminBookVO adminBookVO : bookList) {
            // adminBookVO의 이미지Path를 분리해서 담아줄 ImgliSt 배열 변수 필요
            List<String> imgArray = new ArrayList<>(); // 가변배열 리스트이면서, 값이 없어도 존재해야함 ( npx 방지 )
            if(adminBookVO.getBookImgPath() != null && !adminBookVO.getBookImgPath().isEmpty()){
                imgArray =  new ArrayList<>(
                        Arrays.asList(
                                adminBookVO.getBookImgPath().split(",") //String [] 배열로 반환
                        )//Arrays.asList() 는 배열을 List로 => 고정크기 List
                );// new ArrayList로 수정 가능한 새로운 가변 List 생성

            }
            //for문 종료

            // admingbookVO bookImgList에 담아주기
            adminBookVO.setBookImgList(imgArray);
        }

        //
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


// 인덱스와 primary key 역할을 겸한다면 long type으로 설정해야 데이터베이스 성능이 좋아짐

    @GetMapping("/bookDetail/{bookId}")
    public ResponseEntity<?> getBookDetail(@PathVariable Long bookId,HttpServletRequest request){

        // 아이디를 파라미터로 데이터베이스에 넘겨서 데이터 받아오기
        AdminBookVO adminBookVO = bookService.deTailBook(bookId);
        // adminBookVO 이미지Path를 분리해서 담아줄 ImgliSt 배열 변수 필요
        List<String> imgArray = new ArrayList<>(); // 가변배열 리스트이면서, 값이 없어도 존재해야함 ( npx 방지 )
        if(adminBookVO.getBookImgPath() != null && !adminBookVO.getBookImgPath().isEmpty()){
            imgArray =  new ArrayList<>(
                    Arrays.asList(
                            adminBookVO.getBookImgPath().split(",") //String [] 배열로 반환
                    )//Arrays.asList() 는 배열을 List로 => 고정크기 List
            );// new ArrayList로 수정 가능한 새로운 가변 List 생성

        }
        // admingbookVO bookImgList에 담아주기
        adminBookVO.setBookImgList(imgArray);

        log.info("adminBookVO -----------:{}",adminBookVO);

        Map<String, Object> response = new HashMap<>();
        response.put("bookVO", adminBookVO);

        return  ResponseEntity.ok(response);
    }

    @GetMapping("/bookModify/{bookId}")
    public ResponseEntity<?>  getBookModify(@PathVariable Long bookId,HttpServletRequest request){
        log.info("도서 수정 API 호출됨");

        //카테고리 목록 가져오기
        Map<String, List<CategoryVO>> cateData  = categoryService.getAllCategories();

        //해당 아이디에 대한 도서 정보 가져오기
        AdminBookVO adminBookVO = bookService.deTailBook(bookId);

        List<String> imgArray = new ArrayList<>(); // 가변배열 리스트이면서, 값이 없어도 존재해야함 ( npx 방지 )
        if(adminBookVO.getBookImgPath() != null && !adminBookVO.getBookImgPath().isEmpty()){
            imgArray =  new ArrayList<>(
                    Arrays.asList(
                            adminBookVO.getBookImgPath().split(",") //String [] 배열로 반환
                    )//Arrays.asList() 는 배열을 List로 => 고정크기 List
            );// new ArrayList로 수정 가능한 새로운 가변 List 생성

        }

        // admingbookVO bookImgList에 담아주기
        adminBookVO.setBookImgList(imgArray);
        log.info("adminBookVO -- 삭제 : {}",adminBookVO);
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
            log.info("adminBookVO -- 수정 : {}",updateData);

            List<String> imgArray = new ArrayList<>(); // 가변배열 리스트이면서, 값이 없어도 존재해야함 ( npx 방지 )
            if(updateData.getBookImgPath() != null && !updateData.getBookImgPath().isEmpty()){
                imgArray =  new ArrayList<>(
                        Arrays.asList(
                                updateData.getBookImgPath().split(",") //String [] 배열로 반환
                        )//Arrays.asList() 는 배열을 List로 => 고정크기 List
                );// new ArrayList로 수정 가능한 새로운 가변 List 생성

            }

            // admingbookVO bookImgList에 담아주기
            updateData.setBookImgList(imgArray);

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
    public ResponseEntity<?> deleteBook(@RequestBody List<Long> bookIds,
                                        @RequestParam(defaultValue = "1", name = "currentPage") int page, // 넘어오는 파라미터 명이 다르면 name 설정해주기
                                        @RequestParam(defaultValue = "6") int pageSize,
                                        HttpServletRequest request
                                        ) {
        //1) 유효성검사  ==> 삭제할 도서 아이디가  데이터베이스에 존재하는지에 대한 여부
        //2) 예외 처리: 도서가 존재하지 않거나 삭제가 불가능한 상태일 경우 예외 던지기
        log.info("삭제할 ID들: :{}",bookIds ); // [1, 2, 3]
        log.info("도서 목록 searchkeyword API 호출됨");

        if (bookIds == null || bookIds.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", "삭제할 ID가 없습니다."
            ));
        }

        Map<String, Object> result = new HashMap<>();
        //Advice 미사용 시, 예외에 대해서 try-catch 구문을 사용해서 처리해주기
        try {

            //페이지 계산 클래스 불러오기
            Pagination pagination = new Pagination(page, pageSize);
            log.info("pagination -----------------: {}",pagination);

            //검색필터 설정해주기

            int delResult = bookService.deleteBooks(bookIds);
            log.info("delResult -----------------: {}",delResult);

            if (delResult > 0) {
                // 삭제 성공시 데이터 반환
                //페이지 버튼 개수 수정
                int totalPages = pagination.getTotalPages();

                if (pagination.getCurrentPage() > totalPages) {
                    pagination.setCurrentPage(totalPages == 0 ? 1 : totalPages);
                }

                //전체도서 데이터 조회  : 검색 파라미터 넘겨준 후 반환값에 담
                List<AdminBookVO> bookList = bookService.getAllBooks(pagination);
                log.info("bookList -----------------: {}",bookList);
                // 레코드 순회
                for (AdminBookVO adminBookVO : bookList) {

                    List<String> imgArray = new ArrayList<>(); // 가변배열 리스트이면서, 값이 없어도 존재해야함 ( npx 방지 )
                    if(adminBookVO.getBookImgPath() != null && !adminBookVO.getBookImgPath().isEmpty()){
                        imgArray =  new ArrayList<>(
                                Arrays.asList(
                                        adminBookVO.getBookImgPath().split(",") //String [] 배열로 반환
                                )//Arrays.asList() 는 배열을 List로 => 고정크기 List
                        );// new ArrayList로 수정 가능한 새로운 가변 List 생성
                    }

                    // adminBookVO bookImgList에 담아주기
                    adminBookVO.setBookImgList(imgArray);
                }
                //남은 도서가 없을경우
                if (bookList.isEmpty()) {
                    result.put("message", "삭제 완료. 남은 도서가 없습니다.");
                } else {
                    result.put("message", "삭제 완료");
                }

                result.put("items", bookList);
                result.put("currentPage", pagination.getCurrentPage());
                result.put("pageSize", pagination.getPageSize());
                result.put("totalPages", pagination.getTotalPages());
                result.put("totalRecord", pagination.getTotalRecord());
                result.put("deletedCount", delResult);
                log.info("result -----------------: {}",result);

            }

        } catch (BookNotFoundException ex) {
            // 여기서 예외를 직접 처리!
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "존재하지 않는 도서가 포함되어 있습니다.",
                    "missingIds", ex.getMissingIds(),  // 예외 클래스에서 getter 사용
                    "message", ex.getMessage()
            ));
        }
        //프론트로 응답 반환
        return  ResponseEntity.ok(result);

    }

}

//@ModelAttribute는 formData형태로 넘어올 때 사용하고, 그 외에는 @RequestBody 를 사용해서 Json객체를 Java객체로 맴핑

