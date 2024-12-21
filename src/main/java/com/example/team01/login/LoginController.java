package com.example.team01.login;

import com.example.team01.login.service.LoginService;
import com.example.team01.vo.LoginVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;


@Slf4j
@RestController    //전역 ResponseBody
@RequestMapping()
public class LoginController {

    private final LoginService loginService;

    public LoginController(LoginService loginService) {
        this.loginService = loginService;
    }

    @GetMapping("/login")
    public String getLogin() {
       String data = "로그인 페이지 , getMapping";
        return data;
    }

    @PostMapping("/login")
    public Map<String, Object> postLogin(@RequestBody Map<String, String> user) {
        //프론트에서 넘어 온  파라미터를 변수에 저장해서 가져오기
        String clientId = user.get("id");
        String password = user.get("password");
        String roleId  = user.get("roleId");

        log.info("받은 데이터  clientId = {}, pwd = {}, roleId:{}",clientId, password, roleId);
        // 서비스를 호출해서 받아온 파라미터를 적용 시켜주기
        LoginVO loginInfo = loginService.selectLogin(clientId, password, roleId);

        //json으로 반환해야하니까   Map<String, Object> 로 response 구성하기
        Map<String, Object> response = new HashMap<>();

        //데이터가 null일 때, null 아닐 때
        if(loginInfo != null) {
            response.put("status","success");
            response.put("data",loginInfo);
        }else{
            response.put("status","error");
            response.put("message","로그인 정보가 없습니다.");
        }
        log.info("받은 데이터  response = {}",response );
        return (Map<String, Object>) ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON);
    }



    @GetMapping("/logout")
    public String logout() {

        return "안녕하세요.로그아웃피이지 "+new Date() +"입니다. \n";

    }

}


//Json 데이터를 프론트에서 받아올 때 Map<String, Object> 타입으로 선언 하고 HashMap<String, Object> 사용
// String은 Json의 key 값,  Object는 Json의 value 값 (어떤 데이터가 들어올지 모르니까 Object최상위 타입으로 선언)
//인터페이스 Map 의 HashMap<String, Object> 구현체를 사용하는 이유는 빠른 검색과 중복되지 않는 값