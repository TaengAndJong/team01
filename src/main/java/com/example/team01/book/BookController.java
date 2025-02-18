package com.example.team01.book;


import com.example.team01.book.service.BookService;
import com.example.team01.category.dao.CategoryDao;
import com.example.team01.vo.CategoryVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;



@Slf4j
@RequiredArgsConstructor
@RequestMapping("/book")
@RestController
public class BookController {

    private final BookService bookService;
    CategoryDao dao;
    // bookList Json으로 반환할 GetMapping 메소드
    
    // bookList 수정, 삭제, 등록할 PostMapping 메소드

    @GetMapping("/bookCreate")
    public List<CategoryVO> getBookCreate(){


        List<CategoryVO> data = dao.categoryList();
        log.info("data-------------------",data);
        return data;
    }

}
