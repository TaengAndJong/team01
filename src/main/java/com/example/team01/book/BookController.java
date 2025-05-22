package com.example.team01.book;

import com.example.team01.admin.service.AdminBookService;
import com.example.team01.book.service.BookService;
import com.example.team01.utils.FileUtils;
import com.example.team01.vo.AdminBookVO;
import com.example.team01.vo.BookVO;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@Slf4j
@RequiredArgsConstructor
@RequestMapping("/book")
@RestController
public class BookController {

    private final BookService bookService;
    private final FileUtils fileUtils;

    // get요청에 바인딩되는 bookId는 메소드의 PathVariable로 받아와야 함
    @GetMapping()
    public ResponseEntity<?> getBookList(HttpServletRequest request){

        List<BookVO> allBooksService =  bookService.selectAllBooks();
        log.info("클라이언트 북 :{}", allBooksService);
      // Stream,map 이용해 각 BookVO에 changeImgPath 적용
        List<BookVO> bookVO = allBooksService.stream().map(book -> fileUtils.changeImgPath(book,request))
                .collect(Collectors.toList());
        log.info("bookVO :{}", bookVO );

        return ResponseEntity.ok(bookVO);
    }

    // get요청에 바인딩되는 bookId는 메소드의 PathVariable로 받아와야 함
    //로그인 없이 전체경로 들어오게 하려면 시큐리티 경로 처리 필수
    @GetMapping("/bookDetail/{bookId}")
    public ResponseEntity<?> getBookDetail(@PathVariable String bookId,HttpServletRequest request){
        log.info("bookId :{}", bookId);
        log.info(" 클라이언트 도서 상세페이지 API 호출됨");

        // 아이디를 파라미터로 데이터베이스에 넘겨서 데이터 받아오기
        BookVO bookVO = bookService.selectOneBook(bookId);
        log.info("result ---:{}", bookVO);
        //이미지파일 경로 변경 실행 ( 서버주소 + 이미지 경로)
        fileUtils.changeImgPath(bookVO,request);
        //이미지 bookList 객체 값 확인하기
        log.info("result ---:{}", bookVO);
        
        // Json 형식으로 반환
        Map<String, Object> response = new HashMap<>();
        response.put("bookVO", bookVO);
        // 클라이언트로 응답 보내기
        log.info("response -----------:{}",response);
        return  ResponseEntity.ok(response);


    }

}
