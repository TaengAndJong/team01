package com.example.team01.admin;

import com.example.team01.book.service.BookService;
import com.example.team01.category.dao.CategoryDao;
import com.example.team01.category.service.CategoryService;
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

    @GetMapping("/bookCategory")
    public ResponseEntity<?> getBookCreate(){
        log.info("getBookCreate------------------------");
        //도서 카테고리 목록 조회
        List<CategoryVO> cateData  = categoryService.getAllCategories();
        log.info("cateData:{}",cateData);

        Map<String,Object> response = new HashMap<>();
        response.put("cateData",cateData);
        return ResponseEntity.ok(response);
    }

    @PostMapping(value = "/bookCreate")
    public ResponseEntity<?> insertBookCreate(
            @ModelAttribute BookVO createBook,@RequestParam(name="bookImg", required = false) List<MultipartFile> bookImg) throws FileNotFoundException {

        //VO객체랑 타입이 동일해야 파라미터를 받아올 수 있음
        log.info("BookVO createBook-------------:{}",createBook.toString());
        log.info("MultipartFile bookImg-------------:{}",bookImg);

        // 서비스로 book 정보와 파일을 전달 ( 컨트롤러에서 (비어있어도)파일객체와 기본객체를 분리하지 않고 서비스로 넘겨줌)
        int result = bookService.createBook(createBook);
        log.info("result---------------- ID :{}",createBook.getBookId());
        // 데이터 insert 성공시 결과 반환
        if (result > 0) {
            BookVO addBookData = bookService.deTailBook(createBook.getBookId());
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
        // 리스트 객체를 Map에 담아서 보내면 객체의 배열 key명 변경 가능
        Map<String, Object> response = new HashMap<>();
        response.put("bookVO", bookList);
       return  ResponseEntity.ok(response);

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

        return  ResponseEntity.ok("bookModify");

    }


}



