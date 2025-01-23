package com.example.team01.security.handler;

import com.example.team01.common.service.ClientService;
import com.example.team01.vo.ClientVO;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
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
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        log.info("authentication-------------------onAuthenticationSuccess :{}",authentication);
    //시큐리티나, 클라이언트가 content-type을 text/html로 보낼 수 있기때문에 명시적으로 설정
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        log.info("onAuthenticationSuccess-------------------인증성공 :{}",response);
        //실제 로그인 성공 후의 로직 처리 하는 메소드
        log.info("onAuthenticationSuccess9999-------------------로그인성공");

        // 인증 정보를 세션에 저장 (JSESSIONID 생성)
        request.getSession().setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());
        log.info("onAuthenticationSuccess------10------------------");
        // 로그인 성공시 roleId가 Role_Admin 일때 redirection 주소 관리자로 아니면 /로
        // 사용자 권한 정보 가져오기
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));
        String redirectUrl = isAdmin ? "/admin" : "/";

        // session 정보 및 로그인 사용자 정보 response에 담기
        //1. 로그인 사용자 정보 가져오기
        String username = authentication.getName(); // 사용자 이름
        Collection<? extends GrantedAuthority> roles = authentication.getAuthorities(); // 권한 목록

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

        log.info("responseData-------------------:{}",responseData); //json 응답 반환

       //Jackson 라이브러리의 ObjectMapper를 사용하여 Map 객체를 JSON 문자열로 변환
        ObjectMapper objectMapper = new ObjectMapper();
        String jsonResponse = objectMapper.writeValueAsString(responseData);
        log.info("jsonResponse-------------------jsonResponse:{}",jsonResponse); //json 응답 반환
        // response.getWriter().write()를 사용하여 JSON 응답을 클라이언트로 반환
        response.getWriter().write(jsonResponse); 

    }
// class end

}

