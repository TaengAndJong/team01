package com.example.team01.common.controller;

import com.example.team01.common.dto.AuthResponseDTO;
import com.example.team01.security.PrincipalDetails;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.stream.Collectors;

/*
* 로그인 시, 세션만료되면 체크할 용도
* 시큐리티 설정 permitAll 로 시큐리티를 거치지않고 클라이언트에서 컨트롤러로 바로 요청이 옴
* */


@Slf4j
@RequestMapping("/auth")
@RestController
public class AuthController {

    //인증상태확인 API = 사용자가 현재 로그인(인증된 ) 상태인지를 확인하는 인증 API
    @GetMapping()
    public ResponseEntity<?> authStatus(HttpSession session, Authentication authentication) {
        log.info("인증상태 관리 authController");
        log.info("생성된 sessionID---------------:{}",session.getId());//
        log.info("auth 시큐리티 인증 ---------------:{}",authentication); // null
        if (authentication == null) {
            return ResponseEntity.status(401).build(); 
            // 인증이 없으면 401 상태 전달하고 로그인 유도메시지는 프론트로 위임
            //서버는 상태 코드만 내려주면 됨, 상태에 대한 안내는 프론트가 하면 됨
        }
        //새로고침시 프론트가 인증요청을 보냈을 경우 담아줄 인증객체 ( 로그인 상태 유지하기위함)
        PrincipalDetails principal =
                (PrincipalDetails) authentication.getPrincipal();

        //roleId에 담아줄 role 꺼내기
        String roleId = principal.getAuthorities().stream()
                .map(auth -> auth.getAuthority()).findFirst().orElse("");


        //authResponseDto를 만들어서 구조 수정 및 시큐리티 구조 숨기기
        AuthResponseDTO response = AuthResponseDTO.builder().authenticated(true)
                .clientId(principal.getUserData().getClientId())
                .clientName(principal.getUserData().getClientName())
                .roleId(roleId)
                .build();
        log.info("response--------authController:{}",response);
        
        return ResponseEntity.ok(response);

    }

}
