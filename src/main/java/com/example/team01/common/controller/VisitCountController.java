package com.example.team01.common.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.RestController;

import com.example.team01.common.service.VisitCountService;
import com.example.team01.common.dto.VisitRequestDTO;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Slf4j
@RequestMapping("/check/visit")
@RestController
@RequiredArgsConstructor 
public class VisitCountController {
    
    private final VisitCountService visitCountService;

    @PostMapping
    public ResponseEntity<?> recordVisit(
        @RequestBody VisitRequestDTO dto,
        HttpSession session,
        HttpServletRequest request
    ) {
        log.info("방문 기록: {}", dto);
        // 세션 아이디 가져온 후 dto에 저장
        String sessionId = session != null ? session.getId() : null;
        dto.setSessionId(sessionId);

        // 사용자 공인 IP 프록시로 가져오기
        String ipAddress = request.getHeader("X-Forwarded-For");
        if(ipAddress == null || ipAddress.isEmpty()){
            ipAddress = request.getRemoteAddr();
            log.info("ipAddress: {}", ipAddress);
        }
        dto.setIpAddress(ipAddress);

        int result = visitCountService.insertVisitLog(dto);

        log.info("차트통계데이터 :{}",result);
        return ResponseEntity.ok(result);
    }
}
