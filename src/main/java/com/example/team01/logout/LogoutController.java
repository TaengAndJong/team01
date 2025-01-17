package com.example.team01.logout;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RequestMapping("/logout")
@RestController
public class LogoutController {


    @PostMapping()
    public Map<String,Object> logout(HttpServletRequest request) {
        log.info("request logout=----------:{}",request);

//    스프링 시큐리티 로그아웃필터 어떻게 진입?

        Map<String,Object> logoutInfo = new HashMap<>();
        logoutInfo.put("message","로그아웃성공");

        return logoutInfo;
    }


}
