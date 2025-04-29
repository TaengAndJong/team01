package com.example.team01.admin;

import com.example.team01.book.service.BookService;
import com.example.team01.category.dao.CategoryDao;
import com.example.team01.category.service.CategoryService;
import com.example.team01.common.exception.BookNotFoundException;
import com.example.team01.utils.FileUtils;
import com.example.team01.utils.severUrlUtil;
import com.example.team01.vo.BookVO;
import com.example.team01.vo.CategoryVO;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.example.team01.utils.severUrlUtil.baseImageUrl;

//컨트롤러는 응답과 결과만 반환함

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/admin/book")
@RestController
public class AdminBookController {

    private final CategoryService categoryService;
    private final BookService bookService;
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
            @ModelAttribute BookVO createBook,@RequestParam(name="bookImg", required = false) List<MultipartFile> bookImg,HttpServletRequest request) throws FileNotFoundException {

        //VO객체랑 타입이 동일해야 파라미터를 받아올 수 있음
        log.info("BookVO createBook-------------:{}",createBook.toString());
        log.info("MultipartFile bookImg-------------:{}",bookImg);

        // 서비스로 book 정보와 파일을 전달 ( 컨트롤러에서 (비어있어도)파일객체와 기본객체를 분리하지 않고 서비스로 넘겨줌)
        int result = bookService.createBook(createBook);
        log.info("result---------------- ID :{}",createBook.getBookId());
        // 데이터 insert 성공시 결과 반환
        if (result > 0) {
            BookVO addBookData = bookService.deTailBook(createBook.getBookId());
            //파일 경로 서버주소 반영하는 파일Util
            fileUtils.changeImgPath(addBookData,request);
            return ResponseEntity.ok(addBookData);// 저장된 데이터 전체를 클라이언트에 반환
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Book creation failed");
        }

    }


    @GetMapping("/bookList")
    public ResponseEntity<?>  getBookList(HttpServletRequest request){
        log.info("도서 목록 API 호출됨");
        List<BookVO> bookList  = bookService.getAllBooks();

        for (BookVO bookVO : bookList) {
            log.info("여기:{}",bookVO);
            fileUtils.changeImgPath(bookVO,request); // 새로운 이미지주소를 가진  bookVO객체가 반환됨
            log.info("다음:{}",bookVO);
        }
        // 배열 안에 객체 형태로 내보내려면 원본 Map 사용하지 않고 내보내야함
       return  ResponseEntity.ok(bookList);

    }

// 인덱스와 primary key 역할을 겸한다면 long type으로 설정해야 데이터베이스 성능이 좋아짐

    @GetMapping("/bookDetail/{bookId}")
    public ResponseEntity<?> getBookDetail(@PathVariable String bookId,HttpServletRequest request){
        log.info("bookId :{}", bookId);
        log.info("도서 상세페이지 API 호출됨");

        // 아이디를 파라미터로 데이터베이스에 넘겨서 데이터 받아오기
        BookVO bookVO = bookService.deTailBook(bookId);
        fileUtils.changeImgPath(bookVO,request);

        Map<String, Object> response = new HashMap<>();
        response.put("bookVO", bookVO);
        return  ResponseEntity.ok(response);
    }

    @GetMapping("/bookModify/{bookId}")
    public ResponseEntity<?>  getBookModify(@PathVariable String bookId,HttpServletRequest request){
        log.info("도서 수정 API 호출됨");
        log.info("bookId------------------:{}",bookId);
        //카테고리 목록 가져오기
        Map<String, List<CategoryVO>> cateData  = categoryService.getAllCategories();
        log.info("bookVO--- cateData:{}",cateData);
        //해당 아이디에 대한 도서 정보 가져오기
        BookVO bookVO = bookService.deTailBook(bookId);
        log.info("bookVO--- modify:{}",bookVO);
        fileUtils.changeImgPath(bookVO, request); // 필요 시 이미지 경로 수정

        Map<String,Object> response = new HashMap<>();
        //해당 아이디에 대한 도서데이터와 , 카테고리 데이터를 클라이언트에게 전송하기!
        response.put("book", bookVO);
        response.put("cateData",cateData);
        log.info("response ----------------:{}",response);
        return  ResponseEntity.ok(response);
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
            log.info("서비스로 가기 전 ----------:{}",bookIds);
            int result = bookService.deleteBooks(bookIds);
            log.info("result ----------:{}",result);
            return ResponseEntity.ok(Map.of(
                    "message", "삭제 완료",
                    "deletedCount", result
            ));
        } catch (BookNotFoundException ex) {
            log.info("ex :{}",ex);
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

