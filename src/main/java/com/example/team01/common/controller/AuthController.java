package com.example.team01.common.controller;

import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/*
* 로그인 시, 세션만료되면 체크할 용도
* 시큐리티 설정 permitAll 로 시큐리티를 거치지않고 클라이언트에서 컨트롤러로 바로 요청이 옴
* */


@Slf4j
@RequestMapping("/auth")
@RestController
public class AuthController {

    @GetMapping()
    public ResponseEntity<?> authStatus(HttpSession session, Authentication authentication) {
        log.info("인증상태 관리 authController");
        log.info("생성된 sessionID---------------:{}",session.getId());//
        log.info("auth 시큐리티 인증 ---------------:{}",authentication); // null
        if (authentication == null) { //로그인이 안되었을경우
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "로그인이 필요합니다.  로그인페이지로 이동하시겠습니까?"));
        }
        return ResponseEntity.ok(Map.of("message", "세션 유지 중"));

    }

}
