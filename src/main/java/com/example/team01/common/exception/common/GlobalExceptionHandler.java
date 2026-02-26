package com.example.team01.common.exception.common;


import com.example.team01.common.exception.book.BookException;
import com.example.team01.common.exception.book.BookNotFoundException;
import com.example.team01.common.exception.book.BookUpdateException;
import com.example.team01.common.exception.cart.CustomCartException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.util.HashMap;
import java.util.Map;


@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {


    //특정예외처리 메서드
    @ExceptionHandler(CustomCartException.class)
    public ResponseEntity<Map<String, Object>> handleCartException(CustomCartException e) {
        log.info("비즈니스 예외 발생--- 장바구니 수량부족예외 handleCartException");

        Map<String, Object> result = new HashMap<>();
        result.put("bookId", e.getBookId());
        result.put("message", e.getMessage());
        result.put("maxQuantity", e.getStock());

        return ResponseEntity.badRequest().body(result); //400
    }
    

    // 파일 없음 예외 처리
    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNoResourceFound(NoResourceFoundException e) {
        log.info("파일 없음 예외 처리: {}", e.getMessage());

        Map<String, Object> result = new HashMap<>();
        result.put("message", "요청한 파일을 서버에서 찾을 수 없습니다.");
        result.put("defaultImage", "/images/noImg.png"); // 클라이언트에서 사용할 기본 이미지 경로

        return ResponseEntity.status(404).body(result); // 데이터 없음
    }

    //비즈니스 로직 예외만 처리 ( 400 Bad Request )
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<Map<String, Object>> handleBusinessException(BusinessException e){
        log.info("비즈니스로직 예외발생: {}", e.getMessage());
        
        Map<String, Object> result = new HashMap<>();
        result.put("message", e.getMessage());

        return ResponseEntity.badRequest().body(result);  // 400 상태 코드
    }

    @ExceptionHandler(BookException.class)
    public ResponseEntity<?>  handleBookException(BookException e){
        log.info("파일 없음 예외 처리: {}", e.getMessage());

        // bookNotFoundException
        if (e instanceof BookNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "message", ex.getMessage(),
                            "missingIds", ex.getMissingIds()
                    ));
        }

        //BookUpdateException
        if (e instanceof BookUpdateException ex) {
            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message", ex.getMessage()
                    ));
        }

        //어느 조건도 아니면
        return ResponseEntity.badRequest()
                .body(Map.of(
                        "message", e.getMessage()
                ));
    }


    // 그 외 일반 예외 처리 ( 500 )
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleException(Exception e) {
        log.error("서버 에러 발생: {}", e.getMessage(), e);

        Map<String, Object> result = new HashMap<>();
        result.put("message", "서버에서 처리 중 오류가 발생했습니다.");

        return ResponseEntity.status(500).body(result);
    }


}
