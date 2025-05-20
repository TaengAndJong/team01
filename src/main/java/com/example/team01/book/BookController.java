package com.example.team01.book;

import com.example.team01.book.service.BookService;
import com.example.team01.vo.BookVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
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

    @GetMapping()
    public ResponseEntity<?> getBook(){

        List<BookVO> allBooksService =  bookService.selectAllBooks();
        log.info("클라이언트 북 :{}", allBooksService);



        return ResponseEntity.ok(allBooksService);
    }

}
