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
import java.time.LocalDateTime;

@Slf4j
@RequiredArgsConstructor
@Component
public class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandler {


    private final ClientService clientService;


    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException{

    log.info("로그인성공 시큐리티 클래스 실행 onAuthenticationSuccess");
     log.info("authentication.getName(): {}", authentication.getName());
    //시큐리티나, 클라이언트가 content-type을 text/html로 보낼 수 있기때문에 명시적으로 설정
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        // 로그인 성공시 roleId가 Role_Admin 일때 redirection 주소 관리자로 아니면 /로
        // 사용자 권한 정보 가져오기
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));
        String redirectUrl = isAdmin ? "/admin" : "/";

        log.info("redirectUrl----------:{}", redirectUrl);


        //1. 로그인 사용자 정보 가져오기
        String username = authentication.getName(); // 사용자 이름
        Collection<? extends GrantedAuthority> roles = authentication.getAuthorities(); // 권한 목록

        //로그인 사용자정보
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        log.info("principal--------------------------------:{}", userDetails);
        // clientId를 이용하여 추가 사용자 정보를 가져오기
        ClientVO clientInfo = clientService.getClientWithRole(username);

        //세션에 저장해줘야 SessionCheckController에서 사용가능
        HttpSession session = request.getSession(true);
        session.setAttribute("loginUser", userDetails);       // React 기존 세션 방법과 호환
        //session.setAttribute("loginClientInfo", clientInfo);  // 필요시 저장
        session.setAttribute("loginTime", LocalDateTime.now()); // 커스텀 만료용
        
        // 2.로그인 성공 시  클라이언트로 보내줄 JSON 응답 생성
        Map<String, Object> responseData = new HashMap<>();
        //클라이언트의 로컬스토리지에서 아래 데이터 확인가능
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

