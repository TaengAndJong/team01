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
            @ModelAttribute BookVO createBook,
            @RequestParam("bookImgPath") List<MultipartFile> bookImgPath) {

        // @ModelAttribute 사용하면 createBook 객체로 클라이언트의 모든 필드를 받을 수 있음!
        log.info("BookVO bookImgPath-------------:{}",bookImgPath);
        log.info("BookVO createBook-------------:{}",createBook.toString());


        // 서비스로 book 정보와 파일을 전달
        int result = bookService.createBook(createBook, bookImgPath);
        //

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



