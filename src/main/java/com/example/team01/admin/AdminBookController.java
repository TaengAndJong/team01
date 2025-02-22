package com.example.team01.admin;

import com.example.team01.book.service.BookService;
import com.example.team01.category.dao.CategoryDao;
import com.example.team01.category.service.CategoryService;
import com.example.team01.vo.BookVO;
import com.example.team01.vo.CategoryVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

        //도서 카테고리 목록 조회
        List<CategoryVO> cateData  = categoryService.getAllCategories();

        //클라이언트로 json 반환 Map 인터페이스
        Map<String,Object> response = new HashMap<>();
        response.put("cateData",cateData);
        return response;
    }

    @PostMapping(value = "/bookCreate", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public void postBookCreate( @ModelAttribute BookVO createBook){


        log.info("BookVO createBook-------------:{}",createBook);
        //파일객체와 문자열 데이터 나누기

        //도서 카테고리 목록 조회
        List<CategoryVO> cateData  = categoryService.getAllCategories();

        //클라이언트로 json 반환 Map 인터페이스
        Map<String,Object> response = new HashMap<>();
        response.put("cateData",cateData);

    }


    @GetMapping("/bookList")
    public Map<String,Object> getBookList(){
        log.info("도서 목록 API 호출됨");
        List<BookVO> bookList  = bookService.getAllBooks();
        log.info("data-------------------:{}", bookList);
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



