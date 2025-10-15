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

        log.info("SessionCheckController  진입");
        // loginUser,loginTime은 시큐리티 로그인 성공핸들러에서 세션에 각각 저장해 줘야 사용가능
        // 세션에 저장된 로그인 정보 확인
        Object loginUser = session.getAttribute("loginUser");
        // 로그인한 시간 체크
        LocalDateTime loginTime = (LocalDateTime) session.getAttribute("loginTime");
        //현재시간 체크
        LocalDateTime now = LocalDateTime.now(); 
               
        //결과 메시지 담아서 보낼 맵 ==> Map.of()로 대체가능 ==> 모달 유틸형식에 맞춰 Map객체에 담아서 결과반환
        Map<String,Object> result = new HashMap<>();

        //세션에 저장된 loginUser 값이 존재하면
        if (loginUser != null) {
            log.info("loginUser 확인------------:{}",loginUser);
            // 현재 시간과 로그인 시간 비교
            Duration duration = Duration.between(loginTime, now); // 경과 시간 계산
            log.info("세션에 저장된 로그인한 시간 :{}, 현재시간 : {}, 경과시간 : {}",loginTime,now,duration);
            // 세션이 유효함
            return ResponseEntity.ok().body(loginUser); // 반환하면  클라이언트로 감?
        } else {
            // 세션이 만료됨
            log.info("로그인 만료된 시간 {},",now);
            result.put("message","로그인 페이지로 이동합니다.");
            return ResponseEntity.status(401).body(result);
        }
    }

}
