package com.example.team01.security.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.*;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;

import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

// .failureHandler(customAuthenticationFailureHandler()) // 로그인 실패 핸들러
@Slf4j
@RequiredArgsConstructor
@Component
public class CustomAuthenticationFailureHandler implements AuthenticationFailureHandler {

    private final ObjectMapper objectMapper = new ObjectMapper(); // ObjectMapper 인스턴스 생성

    //로그인 실패 시 JSON 응답을 반환하거나 로그를 찍거나 하는 세밀한 처리가 가능
    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException {
        log.info("failureHandler 로그인 실패 핸들러 진입 :{}",request);
        log.info("failureHandler 로그인 실패 이유 :{}",exception.getMessage());


        String clientId = request.getParameter("clientId");
        String rawPassword = request.getParameter("password");

        log.error("🔥 clientId = '{}'", clientId);
        log.error("🔥 rawPassword = '{}'", rawPassword);
        log.error("🔥 rawPassword length = {}", rawPassword.length());
        log.error("🔥 exception = {}", exception.getClass().getSimpleName());


        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
       // response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401 상태 코드 설정하면 클라이언트에서 200 (response.ok) Json 못받음

        //json 응답에 담을 Map 객체 생성
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("redirect", "/login"); // 리디렉션 경로 추가
        responseData.put("status", "error"); // 프론트에서 조건분기를 위해 상태 분류 추가
        // 예외에 따라 처리하는 방식 다르게 설정
        if (exception instanceof BadCredentialsException) {
            responseData.put("message", "잘못된 아이디 또는 비밀번호입니다.");
        }else if (exception instanceof UsernameNotFoundException) { //아이디 빈값이거나 없을 경우
            responseData.put("message", "존재하지 않는 사용자입니다.");
        } else if (exception instanceof AuthenticationServiceException) {
            responseData.put("message", "아이디 또는 비밀번호를 입력해주세요.");
        }        else if (exception instanceof DisabledException) {
            responseData.put("message", "계정이 비활성화되었습니다. 관리자에게 문의하세요.");
        } else if (exception instanceof LockedException) {
            responseData.put("message", "계정이 잠겼습니다. 관리자에게 문의하세요.");
        } else if (exception instanceof AccountExpiredException) {
            responseData.put("message", "계정이 만료되었습니다. 관리자에게 문의하세요.");
        } else if (exception instanceof CredentialsExpiredException) {
            responseData.put("message", "비밀번호가 만료되었습니다. 비밀번호를 재설정하세요.");
        } else {
            responseData.put("message", "로그인 실패: " + exception.getMessage());
        }

        // ObjectMapper를 사용하여 Map 객체를 JSON 문자열로 변환하여 응답으로 전송
        response.getWriter().write(objectMapper.writeValueAsString(responseData));

    }

}
