package com.example.team01.book;


import com.example.team01.book.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RequiredArgsConstructor
@RequestMapping("/book")
@RestController
public class BookController {

    private final BookService bookService;
    
    // bookList Json으로 반환할 GetMapping 메소드
    
    // bookList 수정, 삭제, 등록할 PostMapping 메소드

}
