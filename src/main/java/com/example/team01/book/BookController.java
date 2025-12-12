package com.example.team01.book;

import com.example.team01.admin.service.AdminBookService;
import com.example.team01.book.service.BookService;
import com.example.team01.utils.FileUtils;
import com.example.team01.utils.Pagination;
import com.example.team01.vo.AdminBookVO;
import com.example.team01.vo.BookVO;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<?> getBookList(@RequestParam(defaultValue = "1") int currentPage,
                                         @RequestParam(defaultValue = "6") int pageSize
                                        ,HttpServletRequest request){
        //페이지 계산 클래스 불러오기
        Pagination pagination = new Pagination(currentPage, pageSize); //현재페이지 && 보여줄 페이지 수
        log.info("pagination -----------------: {} pageSize:{}",currentPage,pageSize);

        List<BookVO> allBooksService =  bookService.selectAllBooks(pagination);

        log.info("클라이언트 북 :{}", allBooksService);
      // Stream,map 이용해 각 BookVO에 changeImgPath 적용
        List<BookVO> bookList = allBooksService.stream().map(book -> fileUtils.changeImgPath(book,request))
                .collect(Collectors.toList());
        log.info("bookVO :{}", bookList );

        Map<String, Object> result = new HashMap<>();
        result.put("items", bookList);
        result.put("currentPage", pagination.getCurrentPage());
        result.put("pageSize", pagination.getPageSize());
        result.put("totalPages", pagination.getTotalPages());
        result.put("totalRecord", pagination.getTotalRecord());
        log.info("result---get:{}",result);

        return ResponseEntity.ok(result);
    }

    // get요청에 바인딩되는 bookId는 메소드의 PathVariable로 받아와야 함
    //로그인 없이 전체경로 들어오게 하려면 시큐리티 경로 처리 필수
    @GetMapping("/bookDetail/{bookId}")
    public ResponseEntity<?> getBookDetail(@PathVariable Long bookId,HttpServletRequest request){
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

    // 도서검색 post요청
    @PostMapping("/bookList")
    public ResponseEntity<?>  getSearchBookList( @RequestParam(required = false) String bookType,
                                                 @RequestParam(required = false) String searchType,
                                                 @RequestParam String keyword,
                                                 @RequestParam(defaultValue = "1") int currentPage,
                                                 @RequestParam(defaultValue = "6") int pageSize,
                                                 HttpServletRequest request){
        log.info("도서 목록 클라이언트 도서 searchkeyword API 호출됨");
        log.info("bookType --------------------: {}",bookType);
        log.info("searchType -------------------: {}",searchType);
        log.info("keyword -----------------: {}",keyword);
        //페이지 계산 클래스 불러오기
        Pagination pagination = new Pagination(currentPage, pageSize);
        log.info("pagination -----------------: {}",pagination);
        log.info("pagination -----------------: {} pageSize:{}",currentPage,pageSize);

        //검색필터 설정해주기
        pagination.addDetailCondition("bookType", bookType);
        pagination.addDetailCondition("searchType", searchType);
        pagination.addDetailCondition("keyword", keyword);

        log.info("DetailContion-----:{}",pagination.getDetailCondition());

        //서비스로 검색 파라미터 넘겨주기
        List<BookVO> bookList = bookService.selectAllBooks(pagination);

        // 레코드 순회
        for (BookVO bookVO : bookList) {
            log.info("여기--검색 책목록:{}", bookVO);
            fileUtils.changeImgPath(bookVO,request); // 새로운 이미지주소를 가진  bookVO객체가 반환됨
            log.info("다음--검색 책목록:{}", bookVO);
        }
        //currentPage=1, pageSize=6, startRow=1, endRow=0, totalRecord=0, totalPages=0 재설정필요 ?
        Map<String, Object> result = new HashMap<>();
        result.put("items", bookList);
        result.put("currentPage", pagination.getCurrentPage());
        result.put("pageSize", pagination.getPageSize());
        result.put("totalPages", pagination.getTotalPages());
        result.put("totalRecord", pagination.getTotalRecord());
        log.info("Search 페이지네이션 result -----------------: {}",result);

        //검색결과가  0 이면 알림메시지 반환

        //응답 반환
        return  ResponseEntity.ok(result);

    }

    


}
