package com.example.team01.security.handler;

import com.example.team01.common.service.ClientService;
import com.example.team01.security.PrincipalDetails;
import com.example.team01.security.dto.LoginResponseDTO;
import com.example.team01.vo.ClientVO;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;

import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
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
//        String username = authentication.getName(); // 사용자 이름
//        Collection<? extends GrantedAuthority> roles = authentication.getAuthorities(); // 권한 목록

        //로그인 사용자정보
         PrincipalDetails principal = (PrincipalDetails) authentication.getPrincipal();
        log.info("principal--------------------------------:{}", principal);

            String username = principal.getUsername();
         //clientId를 이용하여 추가 사용자 정보를 가져오기 , status, userStatus 항목 조회해야함
         ClientVO clientInfo = clientService.getClientWithRole(username);

        //세션에 저장해줘야 SessionCheckController에서 사용가능
        HttpSession session = request.getSession(true);
        session.setAttribute("loginUser", principal);       // React 기존 세션 방법과 호환
        //session.setAttribute("loginClientInfo", clientInfo);  // 필요시 저장
        session.setAttribute("loginTime", LocalDateTime.now()); // 커스텀 만료용

        //roleId 권한 배열에서 꺼내기
        String roleId = principal.getAuthorities().stream()
                .map(auth -> auth.getAuthority()).findFirst().orElse("");

        log.info("로그인 인증 성공 핸들러 roleId  : {}",roleId);

        //2.로그인 성공 시 클라이언트로 보내줄 데이터 DTO 맞춰서 형식 수정하기
        LoginResponseDTO loginresp = LoginResponseDTO.builder()
                .authenticated(true)
                .clientId(clientInfo.getClientId())
                .clientName(clientInfo.getClientName())
                .roleId(roleId)
                .userStatus(clientInfo.getStatus())
                .status("success")
                .message(username +" 로그인 성공")
                .redirect(redirectUrl)
                .build();

        //Jackson 라이브러리의 ObjectMapper를 사용하여 Map 객체를 JSON 문자열로 변환
        ObjectMapper objectMapper = new ObjectMapper();
        String jsonResponse = objectMapper.writeValueAsString(loginresp); //ObjectMapper로 Json 변환
        response.setContentType("application/json"); //ContentType 명시
        response.setCharacterEncoding("UTF-8"); // CharacterEncoding 지정
        response.getWriter().write(jsonResponse);// getWriter().write로 클라이언트에 JSON 전송

    }
// class end

}

/*
* 시큐리티 핸들러가 ObjectMapper를 사용하여 Json으로 자동직렬화 하는 이유
* 1) 핸들러는 컨트롤러가 아님 
* 2) 필터 체인 내부에서 동작
* 3) 반환타입이 ResponseEntity 나 mvc 구조를 사용하지 않음
* 4) 결론, Spirng mvc 자동직렬화가 불가능 ==> 수동으로 직렬화 시켜야함
* 
*  Security 핸들러 → ObjectMapper + getWriter() 로 직접 JSON 보내야 함
* */