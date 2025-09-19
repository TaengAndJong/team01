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


@Slf4j
@RequestMapping("/auth")
@RestController
public class AuthController {

    @GetMapping()
    public ResponseEntity<?> authStatus(HttpSession session, Authentication authentication) {
        log.info("인증상태 관리");
        log.info("session---------------:{}",session.getId());
        log.info("auth---------------:{}",authentication);
        if (authentication != null && authentication.isAuthenticated()) {
            log.info("session.getId---------------:{}",session.getId());
           log.info("username:{}", authentication.getName());
           log.info("roles:{}", authentication.getAuthorities());

            return ResponseEntity.ok(Map.of(
                    "username", authentication.getName(),
                    "roles", authentication.getAuthorities()
            ));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

    }

}
