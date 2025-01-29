package com.example.team01.login;



import com.example.team01.security.UserDetailCustomServiceImple;
import com.example.team01.security.handler.CustomAuthenticationFailureHandler;
import com.example.team01.security.handler.CustomAuthenticationSuccessHandler;
import com.example.team01.vo.LoginVO;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;


// 프론트 주소로 매핑
@Slf4j
@RequestMapping("/login") //전역 ResponseBody
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@RestController
public class LoginController {

    private final UserDetailCustomServiceImple userDetailCustomService;  // UserDetailCustomService를 자동 주입
    private final CustomAuthenticationSuccessHandler customAuthenticationSuccessHandler;
    private final CustomAuthenticationFailureHandler customAuthenticationFailureHandler;


    @GetMapping()
    public String getLogin() {
        String data = "로그인 페이지 , getMapping";
        return data;
    }
    @PostMapping()
    public void  postLogin(@RequestBody LoginVO user, HttpServletRequest request, HttpServletResponse response,HttpSession session) throws IOException {

        log.info("PostMapping------------22222 :{}", user);
        //프론트에서 넘어 온  파라미터를 변수에 저장해서 가져오기
        String clientId = user.getClientId();
        String password = user.getPassword();


        //1. 데이터베이스에 해당 데이터의 클라이언트가 존재하는지 확인하고 데이터 넣기
        try {
            log.info("받은 데이터-----------3333  clientId = {}, pwd = {}", clientId, password);
            // 사용자 정보 조회

            // Spring Security를 사용하여 인증 처리 --> 시큐리티로 어떻게 넘길 것인가

            //사용자 정보를 커스텀 UserDetailCustomServiceImple로부터
            // 사용자 정보를 DB에서 가져오는 서비스로 정보 조회 (DB에서 클라이언트 정보 확인)
            // 객체 주입 필수!
            UserDetails userInfo = userDetailCustomService.loadUserByUsername(clientId);
            // 인증 성공 시 SecurityContext에 설정
            
       
            //비밀번호가 데이터베이스와 동일하면 실행
            if (new BCryptPasswordEncoder().matches(password, userInfo.getPassword())) {
                log.info("받은 데이터-----------777  userInfo.getPassword() : {}", userInfo.getPassword());

                Authentication authentication = new UsernamePasswordAuthenticationToken(
                        userInfo, password, userInfo.getAuthorities());
                log.info("받은 데이터-----------888  authentication : {}", authentication);

                //securityContext에서 에러나고 있는데 처리필요
                // 인증 성공 후 SecurityContext에 인증 정보 설정
                SecurityContext securityContext =   SecurityContextHolder.getContext();
                securityContext.setAuthentication(authentication);
                // 인증 정보를 세션에 저장 (JSESSIONID 생성) --> 스프링에서 세션 자동관리가 안되고있음
                session.setAttribute("SPRING_SECURITY_CONTEXT", securityContext);

                //직접 successHandler 호출
                customAuthenticationSuccessHandler.onAuthenticationSuccess(request, response, authentication);

                request.getSession().setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());
//                log.info("customAuthenticationSuccessHandler---------------------:{}", request);
//                log.info("customAuthenticationSuccessHandler---------------------:{}", response);
//                log.info("customAuthenticationSuccessHandler---------------------:{}", authentication);


            } else {
                // 아이디 비밀번호정보가 데이터베이스와 매칭이  안되면 실행
                //1)  비밀번호 매칭 실패 시 AuthenticationException 생성
                AuthenticationException exception = new BadCredentialsException("Invalid credentials");
                //2) failuerHandler 로그인 실패 처리 핸들러 호출
                customAuthenticationFailureHandler.onAuthenticationFailure(request,response,exception);
                log.warn("Authentication failed for clientId------------------------: {}", user.getClientId());

            }

        } catch (Exception e) {
            log.error("로그인 실패: {}", e.getMessage());
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write("{\"message\": \"로그인 실패: " + e.getMessage() + "\"}");
        }


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