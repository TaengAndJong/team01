package com.example.team01.login;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


// 프론트 주소로 매핑
@Slf4j
@RequestMapping("/login") //전역 ResponseBody
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@RestController
public class LoginController {

//    private final SecurityContextHolderStrategy securityContextHolderStrategy = SecurityContextHolder.getContextHolderStrategy();
//    private final AuthenticationManager authenticationManager;
//    private final CustomAuthenticationSuccessHandler customAuthenticationSuccessHandler;

    @GetMapping()
    public String getLogin() {
        String data = "로그인 페이지 , getMapping";
        return data;
    }


//    @PostMapping()
//    public void postLogin(@RequestBody LoginVO user, HttpServletRequest request, HttpServletResponse response) throws IOException {
//
//
//        //프론트에서 넘어 온  파라미터를 변수에 저장해서 가져오기
//        String clientId = user.getClientId();
//        String password = user.getPassword();
//
//        log.info("id:{},pw:{}1111111------------------", clientId, password);
//
//        // 시큐리티 필터체인 인증 토큰 생성해 넘겨주기
//        UsernamePasswordAuthenticationToken token = UsernamePasswordAuthenticationToken.unauthenticated(
//                clientId,password);
//        // AuthenticationManager에게 인증 요청 및 처리
//        Authentication authentication = authenticationManager.authenticate(token);
//        // SecurityContext 생성 및  인증 정보 설정
//        SecurityContext context = SecurityContextHolder.createEmptyContext();
//        context.setAuthentication(authentication);
//        // 인증 성공 후 SecurityContext에 인증 정보 저장
//        SecurityContextHolder.setContext(context);
//
//        // 로그인후 성공핸들러 처리 위임
//        customAuthenticationSuccessHandler.onAuthenticationSuccess(request, response, authentication);
//
//    }


    @GetMapping("/loginError")
    public String errorLogin() {
        String data = "로그인 페이지 , getMapping";
        return data;
    }


}

//Json 데이터를 프론트에서 받아올 때 Map<String, Object> 타입으로 선언 하고 HashMap<String, Object> 사용
// String은 Json의 key 값,  Object는 Json의 value 값 (어떤 데이터가 들어올지 모르니까 Object최상위 타입으로 선언)
//인터페이스 Map 의 HashMap<String, Object> 구현체를 사용하는 이유는 빠른 검색과 중복되지 않는 값