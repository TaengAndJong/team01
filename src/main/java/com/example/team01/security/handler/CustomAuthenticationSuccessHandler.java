package com.example.team01.security.handler;

import com.example.team01.common.service.ClientService;
import com.example.team01.vo.ClientVO;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContext;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@Component
public class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandler {


    private final ClientService clientService;


    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException{

    log.info("onAuthenticationSuccess--------------------------");

    //시큐리티나, 클라이언트가 content-type을 text/html로 보낼 수 있기때문에 명시적으로 설정
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

//        //실제 로그인 성공 후의 로직 처리 하는 메소드
//        HttpSession jsession = request.getSession(false); // 기존 세션이 없으면 null을 반환
//        if (jsession == null) {
//            jsession = request.getSession(); // 새 세션을 생성
//        }
//        String sessionId = jsession.getId();
//        log.info("sessionId:-----------{}", sessionId);
//
//        // 응담헤더에 쿠키 설정
//        Cookie sessionCookie = new Cookie("JSESSIONID", sessionId);
//        sessionCookie.setPath("/"); // 쿠키가 적용될 경로
//        sessionCookie.setHttpOnly(true); // JavaScript에서 접근할 수 없도록 설정
//        sessionCookie.setSecure(false); // HTTPS 설정 여부
//        sessionCookie.setMaxAge(60 * 60); // 1시간 동안 유효한 쿠키
//        response.addCookie(sessionCookie); // 쿠키를 응답에 추가

        // 로그인 성공시 roleId가 Role_Admin 일때 redirection 주소 관리자로 아니면 /로
        // 사용자 권한 정보 가져오기
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));
        String redirectUrl = isAdmin ? "/admin" : "/";

        log.info("redirectUrl----------:{}", redirectUrl);


        //1. 로그인 사용자 정보 가져오기
        String username = authentication.getName(); // 사용자 이름
        Collection<? extends GrantedAuthority> roles = authentication.getAuthorities(); // 권한 목록

        UserDetails principal = (UserDetails) authentication.getPrincipal();
        log.info("principal--------------------------------:{}", principal);
        // clientId를 이용하여 추가 사용자 정보를 가져오기
        ClientVO clientInfo = clientService.getClientWithRole(username);


        // 2. JSON 응답 생성
        Map<String, Object> responseData = new HashMap<>();

        responseData.put("status","success");
        responseData.put("message", username +" 로그인 성공");
        responseData.put("redirect", redirectUrl);
        responseData.put("roles", roles.stream().map(GrantedAuthority::getAuthority).toList()); // 권한 목록
        responseData.put("clientId", clientInfo.getClientId()); // 사용자이름
        responseData.put("clientName", clientInfo.getClientName()); // 사용자이름
        responseData.put("userStatus", clientInfo.getStatus()); // 회원,사원,관리자
        // responseData.put("sessionId", request.getSession().getId()); // 세션 ID

        //Jackson 라이브러리의 ObjectMapper를 사용하여 Map 객체를 JSON 문자열로 변환
        ObjectMapper objectMapper = new ObjectMapper();
        String jsonResponse = objectMapper.writeValueAsString(responseData);

        // response.getWriter().write()를 사용하여 JSON 응답을 클라이언트로 반환
        response.getWriter().write(jsonResponse);

    }
// class end



}

