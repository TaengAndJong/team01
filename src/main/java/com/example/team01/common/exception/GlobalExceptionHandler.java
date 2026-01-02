package com.example.team01.common.exception;


import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.util.HashMap;
import java.util.Map;


@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    //특정예외처리 메서드
    @ExceptionHandler(CustomCartException.class)
    public ResponseEntity<Map<String, Object>> handleCartException(CustomCartException ex) {
        log.info("비즈니스 예외 발생--- 장바구니 수량부족예외: {}", ex.getMessage());
        log.info("비즈니스 예외 발생--- 장바구니 수량부족예외: {}",  ex.getMessage());
        log.info("비즈니스 예외 발생--- 장바구니 수량부족예외: {}",  ex.getStock());

        Map<String, Object> result = new HashMap<>();
        result.put("bookId", ex.getBookId());
        result.put("message", ex.getMessage());
        result.put("maxQuantity", ex.getStock());

        return ResponseEntity
                .badRequest() // 400
                .body(result);
    }
    
    // 특정예외처리시 메서드 추가
    // 파일 없음 예외 처리
    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNoResourceFound(NoResourceFoundException ex) {
        log.warn("파일 없음 발생: {}", ex.getMessage());

        Map<String, Object> result = new HashMap<>();
        result.put("message", "요청한 파일을 서버에서 찾을 수 없습니다.");
        result.put("defaultImage", "/images/noImg.png"); // 클라이언트에서 사용할 기본 이미지 경로

        return ResponseEntity
                .status(404)
                .body(result);
    }

    // 그 외 일반 예외 처리
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleException(Exception ex) {
        log.error("서버 에러 발생: {}", ex.getMessage(), ex);

        Map<String, Object> result = new HashMap<>();
        result.put("message", "서버에서 처리 중 오류가 발생했습니다.");

        return ResponseEntity
                .status(500)
                .body(result);
    }

}
