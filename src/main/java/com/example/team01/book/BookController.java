package com.example.team01.book;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;



@Slf4j
@RequiredArgsConstructor
@RequestMapping("/book")
@RestController
public class BookController {


    @GetMapping()
    public ResponseEntity<?> getBook(@RequestParam(defaultValue = "1") int currentPage,
                                     @RequestParam(defaultValue = "6") int pageSize
            , HttpServletRequest request){

        return null;
    }

}
