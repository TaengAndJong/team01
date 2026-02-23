package com.example.team01.common.controller;


import com.example.team01.common.dto.SessionCheckDTO;
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
        log.info("Checking session------------------------------세션 확인 : {}",authentication);
        //로그인이 안되있는 경우, securityFilter가 Authentication(인증) 객체를 생성하지 않아 Security Context에 저장이 안되어있기때문에
        //컨트롤러에 자동주입이 안되면 null로 판정, 이로서 세션유지 또는 로그인 여부 판단

        //시큐리티의 authentication이 null 이면 프론트에게 authenticated 상태를 false로 반환해줘서 갱신해야함
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.ok(SessionCheckDTO.builder().authenticated(false).build());
        }

        //인증 객체가 PrincipalDetails 타입이 아니면 (다른 인증 방식 제외하는 코드)
        if (!(authentication.getPrincipal() instanceof PrincipalDetails principal)) {
            return ResponseEntity.ok(SessionCheckDTO.builder().authenticated(false).build());
        }


        String roles = authentication.getAuthorities().stream()
                .findFirst()
                .map(GrantedAuthority::getAuthority)
                .orElse(null);

        // 권한 목록 배열에서 권한만 담아주기
        String roleId =authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority).findFirst().orElse("");


        //반환할 정보들 설정 
        SessionCheckDTO checkResp = SessionCheckDTO.builder()
                .authenticated(true)
                .clientId(principal.getUserData().getClientId())
                .clientName(principal.getUserData().getClientName())
                .roleId(roleId)
                .build();

        //담아서 클라이언트로 보내기
        return ResponseEntity.ok(checkResp);
    }

}


/*
* authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority).findFirst().orElse("");

1) stream() : 빈 스트림 
2) findFirst() : optional 반환 , 값 없으면 optional.empty()
3) orElse("") : 값 없으면 ""(빈 문자열 ) , null 포인트 예외 방지

* */