package com.example.team01.common.advice;


import com.example.team01.common.exception.CustomCartException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class BookExceptionAdvice {

    //장바구니 예외처리메서도
    @ExceptionHandler(CustomCartException.class)
    public ResponseEntity<?> cartExceptionAdvice(CustomCartException ex) {
        Map<String, Object> error = new HashMap<>();
        error.put("message", ex.getMessage());
        error.put("bookId", ex.getBookId());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

}
