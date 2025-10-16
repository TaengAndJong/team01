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
import org.springframework.web.bind.annotation.RequestParam;


@Slf4j
@RestController    //전역 ResponseBody
@RequestMapping("/admin")
public class AdminController {


    @GetMapping
    public Map<String, Object> adminHandler(HttpSession session) {
        Object authentication = session.getAttribute("SPRING_SECURITY_CONTEXT");
        log.info("authentication-----------------: {}", authentication);
        if (authentication == null) {
            log.warn("사용자가 인증되지 않았습니다.");
        }

        log.info("Authentication in session: {}", authentication);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "안녕하세요. 관리자 페이지입니다.");
        response.put("timestamp", new java.util.Date());
        return response;
    }

    // 문의별 게시물 데이터 길이 반환

    // 1:1 문의 url : "/amdin/qna/new/count"
    @GetMapping("/qna/new/count")
    public ResponseEntity<?> getNewOneLength()
    {
        return  ResponseEntity.ok("통신성공");
    }
    // 상품 문의 url : "/admin/product/new/count"
        @GetMapping("/product/new/count")
    public ResponseEntity<?> getNewProductLength()
    {
        return  ResponseEntity.ok("통신성공");
    }
    // 배송 문의 url : "/admin/delivery/new/count"
        @GetMapping("/delivery/new/count")
    public ResponseEntity<?> getNewDeliveryLength()
    {
        return  ResponseEntity.ok("통신성공");
    }
    // 금일 기준(00시) 신규 가입자 반환
    
    // 신규 등록 도서 데이터 가져오기 (테이블로 출력 할 꺼임)
    @GetMapping("path")
    public ResponseEntity<?> getTodaysDomesticBooks(@RequestParam String param) {
        return ResponseEntity.ok("통신 완료");
    }
        @GetMapping("path")
    public ResponseEntity<?> getTodaysForeignBooks(@RequestParam String param) {
        return ResponseEntity.ok("통신 완료");
    }
        @GetMapping("path")
    public ResponseEntity<?> getTodaysEBooks(@RequestParam String param) {
        return ResponseEntity.ok("통신 완료");
    }
    
    // 재고 부족 도서 데이터 가져오기 (테이블로 출력 할 꺼임)
}
