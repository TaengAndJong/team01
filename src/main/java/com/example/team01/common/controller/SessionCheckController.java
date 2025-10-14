package com.example.team01.common.controller;


import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RequestMapping("/check")
@RestController
public class SessionCheckController {

    @GetMapping("/session")
    public ResponseEntity<?> checkSession(HttpSession session) {

        log.info("SessionCheckController 세션 체크 핸들러 진입");

        //세션에 저장된
        Object user = session.getAttribute("loginUser"); // 세션에 저장된 로그인 정보 확인
        LocalDateTime loginTime = (LocalDateTime) session.getAttribute("loginTime"); // 로그인한 시간

        log.info("SessionCheckController 세션 체크 핸들러=========:{}",user);

        //결과 메시지 담아서 보낼 맵 ==> Map.of()로 대체가능
        Map<String,Object> result = new HashMap<>();

        LocalDateTime now = LocalDateTime.now();
        if (user != null) {
            log.info("user------------세션확인",user);
            // 현재 시간과 로그인 시간 비교

            Duration duration = Duration.between(loginTime, now); // 경과 시간 계산

            log.info("로그인시간 ------------:{},",now);
            log.info("로그인시간 경과시간 ------------:{},",duration);
            // 세션이 유효함
            return ResponseEntity.ok().body(user);
        } else {
            // 세션이 만료됨
            log.info("로그인시간만료 ------------{},",now);
            result.put("message","세션이 만료되었습니다. 로그인 페이지로 이동합니다.");
            return ResponseEntity.status(401).body(result);
        }
    }

}
