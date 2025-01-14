package com.example.team01.security.handler;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Slf4j
@Component
public class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandler {


    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
    //시큐리티나, 클라이언트가 content-type을 text/html로 보낼 수 있기때문에 명시적으로 설정
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        log.info("onAuthenticationSuccess-------------------인증성공 :{}",response);
        //실제 로그인 성공 후의 로직 처리 하는 메소드
        log.info("onAuthenticationSuccess9999-------------------로그인성공");

        // 인증 정보를 세션에 저장
        request.getSession().setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());

        // 로그인 성공시 roleId가 Role_Admin 일때 redirection 주소 관리자로 아니면 /로
        // 사용자 권한 정보 가져오기
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));
        String redirectUrl = isAdmin ? "/admin" : "/";

        log.info("redirectUrl------------------:{}",redirectUrl);
        log.info("Response committed before redirect: {}", response.isCommitted());

        // JSON 응답으로 리디렉션 URL 전달
        String jsonResponse = String.format("{\"message\": \"로그인 성공\", \"redirect\": \"%s\"}", redirectUrl);
        log.info("jsonResponse-------------------jsonResponse:{}",jsonResponse); //json 응답 반환
        response.getWriter().write(jsonResponse);

    }
// class end

}
