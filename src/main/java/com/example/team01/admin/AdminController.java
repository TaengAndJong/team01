package com.example.team01.admin;

import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController    //전역 ResponseBody
@RequestMapping("/admin")
public class AdminController {

//    @GetMapping()
//    public String adminHandler() {
//        String data = "안녕하세요. 관리자 페이지 " + new Date() + "입니다.\n";
//        return data;
//    }

    @GetMapping
    public Map<String, Object> adminHandler(HttpSession session) {

        Object authentication = session.getAttribute("SPRING_SECURITY_CONTEXT");
        log.info("Authentication in session: {}", authentication);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "안녕하세요. 관리자 페이지입니다.");
        response.put("timestamp", new java.util.Date());
        return response;
    }


}
