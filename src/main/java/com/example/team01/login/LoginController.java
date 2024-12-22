package com.example.team01.login;

import com.example.team01.login.service.LoginService;
import com.example.team01.security.CustomUserDetailsService;
import com.example.team01.vo.LoginVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;


@Slf4j
@RestController    //전역 ResponseBody
@RequestMapping()
public class LoginController {

    private final LoginService loginService;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService customUserDetailsService;

    public LoginController(LoginService loginService, AuthenticationManager authenticationManager, CustomUserDetailsService customUserDetailsService) {
        this.loginService = loginService;
        this.authenticationManager = authenticationManager;
        this.customUserDetailsService = customUserDetailsService;
    }

    @GetMapping("/login")
    public String getLogin() {
        String data = "로그인 페이지 , getMapping";
        return data;
    }

    @PostMapping("/login")
    public Map<String, Object> postLogin(@RequestBody Map<String, String> user) {
        //프론트에서 넘어 온  파라미터를 변수에 저장해서 가져오기
        String clientId = user.get("clientId");
        String password = user.get("password");
//        String roleId  = user.get("roleId");
        log.info("받은 데이터  clientId = {}, pwd = {}",clientId, password);
        log.info("받은 데이터  user = {}", user);

        try {
            // 사용자 정보 조회
            LoginVO loginInfo = loginService.selectClientId(clientId);

            // 만약 사용자 정보가 없다면 예외 처리
            if (loginInfo == null) {
                log.info("사용자 정보 없음");
                return Map.of("message", "사용자 정보 없음");
            }

            // 인증을 위한 UsernamePasswordAuthenticationToken 생성
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(clientId, password)
            );

            // 인증이 성공한 경우 UserDetails 로드
            UserDetails userDetails = customUserDetailsService.loadUserByUsername(clientId);

            // 인증 성공 시, 사용자 정보를 응답
            log.info("로그인 성공: {}", userDetails.getUsername());
            return Map.of("message", "로그인 성공", "user", userDetails);

        } catch (Exception e) {
            // 로그인 실패 시 예외 처리
            log.error("로그인 실패: {}", e.getMessage());
            return Map.of("message", "로그인 실패");
        }
    }



    @GetMapping("/logout")
    public String logout() {

        return "안녕하세요.로그아웃피이지 "+new Date() +"입니다. \n";

    }

}


//Json 데이터를 프론트에서 받아올 때 Map<String, Object> 타입으로 선언 하고 HashMap<String, Object> 사용
// String은 Json의 key 값,  Object는 Json의 value 값 (어떤 데이터가 들어올지 모르니까 Object최상위 타입으로 선언)
//인터페이스 Map 의 HashMap<String, Object> 구현체를 사용하는 이유는 빠른 검색과 중복되지 않는 값