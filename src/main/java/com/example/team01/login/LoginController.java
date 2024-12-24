package com.example.team01.login;

import com.example.team01.login.service.LoginService;

import com.example.team01.vo.LoginVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Date;
import java.util.Map;


@Slf4j
@RestController    //전역 ResponseBody
@RequestMapping()

public class LoginController {

    @Autowired
    private  LoginService loginService;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;


    @GetMapping("/login")
    public String getLogin() {
        String data = "로그인 페이지 , getMapping";
        return data;
    }

    @PostMapping("/login")
    public Map<String, Object> postLogin(@RequestBody LoginVO user) {
        //프론트에서 넘어 온  파라미터를 변수에 저장해서 가져오기
        String clientId = user.getClientId();
        String password = bCryptPasswordEncoder.encode(user.getPassword());
//       String roleId  = user.get("roleId");
        log.info("받은 데이터  clientId = {}, pwd = {}",clientId, password);
        log.info("받은 데이터  user = {}", user);

        //1. 데이터베이스에 해당 데이터의 클라이언트가 존재하는지 확인하고 데이터 넣기
        
        
        
        try {
            // 사용자 정보 조회
            LoginVO loginInfo = loginService.selectClientId(clientId);

            // 만약 사용자 정보가 없다면 예외 처리
            if (loginInfo == null) {
                log.info("사용자 정보 없음");
                return Map.of("message", "사용자 정보 없음");
            }

        } catch (Exception e) {
            // 로그인 실패 시 예외 처리
            log.error("로그인 실패: {}", e.getMessage());
            return Map.of("message", "로그인 실패");
        }
        return null;

    }



    @GetMapping("/logout")
    public String logout() {

        return "안녕하세요.로그아웃피이지 "+new Date() +"입니다. \n";

    }

}


//Json 데이터를 프론트에서 받아올 때 Map<String, Object> 타입으로 선언 하고 HashMap<String, Object> 사용
// String은 Json의 key 값,  Object는 Json의 value 값 (어떤 데이터가 들어올지 모르니까 Object최상위 타입으로 선언)
//인터페이스 Map 의 HashMap<String, Object> 구현체를 사용하는 이유는 빠른 검색과 중복되지 않는 값