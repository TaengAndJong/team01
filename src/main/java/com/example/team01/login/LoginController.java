package com.example.team01.login;

import com.example.team01.security.PrincipalDetails;
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
import java.util.HashMap;
import java.util.Map;


// 프론트 주소로 매핑
@Slf4j
@RequestMapping("/login") //전역 ResponseBody
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@RestController
public class LoginController {


    private final AuthenticationManager authenticationManager;
    private final CustomAuthenticationSuccessHandler customAuthenticationSuccessHandler;

    @GetMapping()
    public String getLogin() {
        String data = "로그인 페이지 , getMapping";
        return data;
    }


    @PostMapping()
    public void postLogin(@RequestBody LoginVO user, HttpServletRequest request, HttpServletResponse response) throws IOException {


        //프론트에서 넘어 온  파라미터를 변수에 저장해서 가져오기
        String clientId = user.getClientId();
        String password = user.getPassword();

        log.info("id:{},pw:{}1111111------------------", clientId, password);
        // 시큐리티 필터체인에게 넘겨주기
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(clientId, password);
        log.info("authenticationToken222222-----------------:{}", authenticationToken);

        // AuthenticationManager에게 인증 요청
        Authentication authentication = authenticationManager.authenticate(authenticationToken);
        log.info("authentication33333-------------:{}", authentication);
        // 인증 성공 후 SecurityContext에 인증 정보 저장
        SecurityContextHolder.getContext().setAuthentication(authentication);
        log.info("SecurityContext에 인증 정보 저장44444-------------:");
        // 로그인후 성공핸들러 처리 위임
       customAuthenticationSuccessHandler.onAuthenticationSuccess(request, response, authentication);
    }


    @GetMapping("/loginError")
    public String errorLogin() {
        String data = "로그인 페이지 , getMapping";
        return data;
    }


}

//Json 데이터를 프론트에서 받아올 때 Map<String, Object> 타입으로 선언 하고 HashMap<String, Object> 사용
// String은 Json의 key 값,  Object는 Json의 value 값 (어떤 데이터가 들어올지 모르니까 Object최상위 타입으로 선언)
//인터페이스 Map 의 HashMap<String, Object> 구현체를 사용하는 이유는 빠른 검색과 중복되지 않는 값