package com.example.team01.admin;

import com.example.team01.book.service.BookService;
import com.example.team01.category.dao.CategoryDao;
import com.example.team01.category.service.CategoryService;
import com.example.team01.vo.BookVO;
import com.example.team01.vo.CategoryVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

//컨트롤러는 응답과 결과만 반환함

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/admin/book")
@RestController
public class AdminBookController {

    private final CategoryService categoryService;
    private final BookService bookService;

    @GetMapping("/bookCreate")
    public Map<String,Object> getBookCreate(){
        log.info("getBookCreate------------------------");
        //도서 카테고리 목록 조회
        List<CategoryVO> cateData  = categoryService.getAllCategories();
        log.info("cateData:{}",cateData);
        //클라이언트로 json 반환 Map 인터페이스
        Map<String,Object> response = new HashMap<>();
        response.put("cateData",cateData);
        return response;
    }

    @PostMapping(value = "/bookCreate")
    public ResponseEntity<?> insertBookCreate(
            @ModelAttribute BookVO createBook,@RequestParam(name="bookImg", required = false) List<MultipartFile> bookImg) {

        //VO객체랑 타입이 동일해야 파라미터를 받아올 수 있음
        log.info("BookVO createBook-------------:{}",createBook.toString());
        //파일 객체 null || isEmpty() 검증 필요
        if (bookImg == null || bookImg.isEmpty()) {
            System.out.println("파일이 없습니다.");
            return ResponseEntity.ok("파일 없음 처리");
        }
        log.info("bookImgPath.size()--------------------:{}",bookImg.size());
        //파일 객체관련 데이터가 존재할경우 실행
        for (MultipartFile multipartFile : bookImg) {
            log.info("bookImgPath:{}",multipartFile.toString());
        }

        // 서비스로 book 정보와 파일을 전달
       // int result = bookService.createBook(createBook, bookImgPath);
        int result = bookService.createBook(createBook);
        // 데이터 insert 성공시 결과 반환
        if (result > 0) {
            return ResponseEntity.ok("Book created successfully");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Book creation failed");
        }

    }


    @GetMapping("/bookList")
    public Map<String,Object> getBookList(){
        log.info("도서 목록 API 호출됨");
        List<BookVO> bookList  = bookService.getAllBooks();
        log.info("bookList data-------------------:{}", bookList);

        //실제이미지 파일 bookList 객체에 담아주기 (배열일 경우 ","를 기준을 나누기)

        //json형태로 반환
        Map<String,Object> response = new HashMap<>();

        if(bookList != null) {
            response.put("data", bookList);

        }else {
            response.put("msg","데이터가 없습니다.");
        }

       return response;

    }



}



