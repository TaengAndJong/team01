package com.example.team01.book;


import com.example.team01.book.service.BookService;
import com.example.team01.utils.FileUtils;
import com.example.team01.utils.Pagination;
import com.example.team01.vo.BookVO;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
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

        List<String> bookImgList;

        for (BookVO bookVO : allBooksService) {
            bookImgList =  Arrays.stream(Optional.ofNullable(bookVO.getBookImgPath()).orElse("").split(","))
                    .map(String::trim).filter(s -> !s.isEmpty()).collect(Collectors.toList());

            log.info("bookImgList bookController :{}", bookImgList );
            bookVO.setBookImgList(bookImgList);

        }

        log.info("bookImgList allBooksService :{}", allBooksService );

        Map<String, Object> result = new HashMap<>();
        result.put("items", allBooksService);
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
        // BookVO 이미지Path를 분리해서 담아줄 ImgliSt 배열 변수 필요
        List<String> imgArray = new ArrayList<>(); // 가변배열 리스트이면서, 값이 없어도 존재해야함 ( npx 방지 )
        if(bookVO.getBookImgPath() != null && !bookVO.getBookImgPath().isEmpty()){
            imgArray =  new ArrayList<>(
                    Arrays.asList(
                            bookVO.getBookImgPath().split(",") //String [] 배열로 반환
                    )//Arrays.asList() 는 배열을 List로 => 고정크기 List
            );// new ArrayList로 수정 가능한 새로운 가변 List 생성

        }
        // BookVO bookImgList에 담아주기
        bookVO.setBookImgList(imgArray);
        //이미지 bookList 객체 값 확인하기
        log.info("bookList------------ 북 컨트롤러 '{}' 이미지 경로 변경 완료", bookVO);
        
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
                                                 @RequestParam(required = false) String recomType,
                                                 @RequestParam String keyword,
                                                 @RequestParam(defaultValue = "1") int currentPage,
                                                 @RequestParam(defaultValue = "6") int pageSize,
                                                 HttpServletRequest request){
        log.info("도서 목록 클라이언트 도서 searchkeyword API 호출됨");
        log.info("bookType --------------------: {}",bookType);
        log.info("searchType -------------------: {}",searchType);
        log.info("recomType -------------------: {}",recomType);
        log.info("keyword -----------------: {}",keyword);
        //페이지 계산 클래스 불러오기
        Pagination pagination = new Pagination(currentPage, pageSize);
        log.info("pagination -----------------: {}",pagination);
        log.info("pagination -----------------: {} pageSize:{}",currentPage,pageSize);

        //검색필터 설정해주기
        pagination.addDetailCondition("bookType", bookType);
        pagination.addDetailCondition("searchType", searchType);
        pagination.addDetailCondition("recomType", recomType);
        pagination.addDetailCondition("keyword", keyword);

        log.info("DetailContion-----:{}",pagination.getDetailCondition());

        //서비스로 검색 파라미터 넘겨주기
        List<BookVO> bookList = bookService.selectAllBooks(pagination);

        // 레코드 순회
        for (BookVO bookVO : bookList) {
            log.info("여기--검색 책목록:{}", bookVO);
            List<String> imgArray = new ArrayList<>(); // 가변배열 리스트이면서, 값이 없어도 존재해야함 ( npx 방지 )
            if(bookVO.getBookImgPath() != null && !bookVO.getBookImgPath().isEmpty()){
                imgArray =  new ArrayList<>(
                        Arrays.asList(
                                bookVO.getBookImgPath().split(",") //String [] 배열로 반환
                        )//Arrays.asList() 는 배열을 List로 => 고정크기 List
                );// new ArrayList로 수정 가능한 새로운 가변 List 생성
            }
            // bookVO bookImgList에 담아주기
            bookVO.setBookImgList(imgArray);
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
