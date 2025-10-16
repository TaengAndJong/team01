package com.example.team01.admin;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.team01.admin.service.AdminService;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import org.springframework.web.bind.annotation.RequestParam;
import java.util.List;

@Slf4j
@RestController    //전역 ResponseBody
@RequiredArgsConstructor
@RequestMapping("/admin")
public class AdminController {

    private final AdminService adminService;

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

    @GetMapping("/newCount")
    public ResponseEntity<?> getNewQnaOneLength()
    {
        int result1 = adminService.getQnaOneLength();
        int result2 = adminService.getProductLength();
        int result3 = adminService.getDeliveryLength();
        log.info("Controller result1: {}, result2: {}, result3: {}", result1, result2, result3);
        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("qnaCount", result1);
        resultMap.put("productCount", result2);
        resultMap.put("deliveryCount", result3);

        return  ResponseEntity.ok(resultMap);
    }

    // // 금일 기준(00시) 신규 가입자 반환
    
    // 신규 등록 도서 데이터 가져오기 (테이블로 출력 할 꺼임)
    @GetMapping("/domesticToday")
    public ResponseEntity<?> getTodaysDomesticBooks() {
        return ResponseEntity.ok("domesticToday 통신 완료");
    }
    @GetMapping("/foreignToday")
    public ResponseEntity<?> getTodaysForeignBooks() {
        return ResponseEntity.ok("foreignToday 통신 완료");
    }
    @GetMapping("/ebooksToday")
    public ResponseEntity<?> getTodaysEBooks() {
        return ResponseEntity.ok("ebooksToday 통신 완료");
    }
    
    // 재고 부족 도서 데이터 가져오기 (테이블로 출력 할 꺼임)
    @GetMapping("/domesticStock")
    public ResponseEntity<?> getStockDomesticBooks() {
        return ResponseEntity.ok("domesticStock 통신 완료");
    }
    @GetMapping("/foreignStock")
    public ResponseEntity<?> getStockForeignBooks() {
        return ResponseEntity.ok("foreignStock 통신 완료");
    }
    @GetMapping("/ebooksStock")
    public ResponseEntity<?> getStockEBooks() {
        return ResponseEntity.ok("ebooksStock 통신 완료");
    }
}
