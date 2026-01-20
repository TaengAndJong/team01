package com.example.team01.common.exception.signup;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

/*
* RestControllerAdvice의 basePackages 설정은
* 해당패키지의 컨트롤러에서 발생하는 예외만 처리하도록 제한
* 어떤 컨트롤러 범위에 적용할지 지정하는 필터 역할
*/

@Slf4j
@RestControllerAdvice(basePackages = "com.example.team01.signup")
public class SignupExceptionHandler {

    //아이디에 대한 특정예외처리
    @ExceptionHandler(IdException.class)
    public ResponseEntity<Map<String, Object>> handleIdException(IdException e) {
        log.info("아이디 예외 처리 핸들러: {}", e.getMessage());
        Map<String, Object> result = new HashMap<>();
        result.put("message", e.getMessage());
        return ResponseEntity.badRequest().body(result);// 400
    }

    //이메일 대한 특정예외처리 메서드
    @ExceptionHandler(EmailException.class)
    public ResponseEntity<Map<String, Object>> handleEmailException(EmailException e) {
        log.info("이메일  예외 처리 핸들러: {}", e.getMessage());
        Map<String, Object> result = new HashMap<>();
        result.put("message", e.getMessage());
        return ResponseEntity.badRequest().body(result);// 400
    }

    //비밀번호 특정예외처리 메서드
    @ExceptionHandler(PasswordException.class)
    public ResponseEntity<Map<String, Object>> handlePasswordException(PasswordException e) {
        log.info("비밀번호 예외 처리 핸들러: {}", e.getMessage());
        Map<String, Object> result = new HashMap<>();
        result.put("message", e.getMessage());
        return ResponseEntity.badRequest().body(result);// 400
    }

    //전화번호 특정예외처리 메서드
    @ExceptionHandler(PhoneNumberException.class)
    public ResponseEntity<Map<String, Object>> handlePhoneNumberException(PhoneNumberException e) {
        log.info("비밀번호 예외 처리 핸들러: {}", e.getMessage());
        Map<String, Object> result = new HashMap<>();
        result.put("message", e.getMessage());
        return ResponseEntity.badRequest().body(result);// 400
    }



}
