package com.example.team01.login;

import com.example.team01.security.handler.CustomAuthenticationFailureHandler;
import com.example.team01.security.handler.CustomAuthenticationSuccessHandler;
import com.example.team01.vo.LoginVO;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;


// 프론트 주소로 매핑
@Slf4j
@RequestMapping("/login") //전역 ResponseBody
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@RestController
public class LoginController {


    private final CustomAuthenticationSuccessHandler customAuthenticationSuccessHandler;
    private final CustomAuthenticationFailureHandler customAuthenticationFailureHandler;
    private final AuthenticationManager authenticationManager;


    @GetMapping()
    public String getLogin() {
        String data = "로그인 페이지 , getMapping";
        return data;
    }


    @PostMapping()
    public void  postLogin(@RequestBody LoginVO user, HttpServletRequest request, HttpServletResponse response,HttpSession session) throws IOException {

        //프론트에서 넘어 온  파라미터를 변수에 저장해서 가져오기
        String clientId = user.getClientId();
        String password = user.getPassword();
        //시큐리티 인증 시도
        try{
            // 1. UsernamePasswordAuthenticationToken 생성
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(clientId, password);

            // 2. AuthenticationManager를 사용하여 인증 시도
            Authentication authentication = authenticationManager.authenticate(authenticationToken);

            // 3. 인증이 성공하면 SecurityContext에 인증 정보 저장
            SecurityContextHolder.getContext().setAuthentication(authentication);

            //4.직접 successHandler 호출l
           customAuthenticationSuccessHandler.onAuthenticationSuccess(request, response, authentication);
            // session 정보 및 로그인 사용자 정보(인증정보) response에 담기
            session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());



        } catch (AuthenticationException e) {
            // 아이디 비밀번호정보가 데이터베이스와 매칭이  안되면 실행
            //1)  비밀번호 매칭 실패 시 AuthenticationException 생성
            AuthenticationException exception = new BadCredentialsException("Invalid credentials");
            //2) failuerHandler 로그인 실패 처리 핸들러 호출
            customAuthenticationFailureHandler.onAuthenticationFailure(request,response,exception);
            log.warn("Authentication failed for clientId------------------------: {}", user.getClientId());
        }


    }



    @GetMapping("/loginError")
    public String errorLogin() {
        String data = "로그인 페이지 , getMapping";
        return data;
    }

    private void deleteExistingCookie(HttpServletResponse response, String cookieName) {
        Cookie cookie = new Cookie(cookieName, null);
        cookie.setPath("/"); // 쿠키 경로를 설정
        cookie.setMaxAge(0); // 쿠키 만료 시간을 0으로 설정하여 삭제
        response.addCookie(cookie);
    }

}

//Json 데이터를 프론트에서 받아올 때 Map<String, Object> 타입으로 선언 하고 HashMap<String, Object> 사용
// String은 Json의 key 값,  Object는 Json의 value 값 (어떤 데이터가 들어올지 모르니까 Object최상위 타입으로 선언)
//인터페이스 Map 의 HashMap<String, Object> 구현체를 사용하는 이유는 빠른 검색과 중복되지 않는 값