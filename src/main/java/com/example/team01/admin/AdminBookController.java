package com.example.team01.admin;

import com.example.team01.book.service.BookService;
import com.example.team01.category.dao.CategoryDao;
import com.example.team01.category.service.CategoryService;
import com.example.team01.vo.BookVO;
import com.example.team01.vo.CategoryVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

        List<CategoryVO> data  = categoryService.getAllCategories();
        log.info("data-------------------:{}",categoryService.getAllCategories());
        //json형태로 반환
        Map<String,Object> response = new HashMap<>();
        response.put("data",data);
        return response;
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



