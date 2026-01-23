package com.example.team01.common.controller;


import com.example.team01.security.PrincipalDetails;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
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

    //세션이 살아있는지 상태만 확인하는 상태확인 API로 정보만 반환 해야 함 ==> 앱 시작 / 새로고침 시 세션확인용
    //인증,권한, 상태코드 정의하면 안됨
    
    @GetMapping("/session")
    public ResponseEntity<?> checkSession(Authentication authentication) {
        log.info("Checking session------------------------------세션 확인");
        //시큐리티의 authentication이 null 이면 프론트에게 authenticated 상태를 false로 반환해줘서 갱신해야함
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.ok(Map.of("authenticated", false));
        }

        if (!(authentication.getPrincipal() instanceof PrincipalDetails principal)) {
            return ResponseEntity.ok(Map.of(
                    "authenticated", false
            ));
        }


        String roles = authentication.getAuthorities().stream()
                .findFirst()
                .map(GrantedAuthority::getAuthority)
                .orElse(null);

        return ResponseEntity.ok(
                Map.of(
                        "authenticated", true,
                        "userData", principal.getUserData(),
                        "roles",roles
                )
        );
    }

}
