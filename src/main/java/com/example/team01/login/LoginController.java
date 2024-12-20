package com.example.team01.login;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;


@Slf4j
@RestController    //전역 ResponseBody
@RequestMapping()
public class LoginController {

    @GetMapping("/login")
    public String getLogin() {
       String data = "로그인 페이지 , getMapping";
        return data;
    }

    @PostMapping("/login")
    public Map<String, Object> postLogin(@RequestBody Map<String, String> user) {
        //프론트에서 넘어 온  파라미터 변수에 저장해서 가져오기, 개발자도구 네트워크확인하기
        String id = user.get("id");
        String password = user.get("password");

        log.info("parameter : {}",id);
        log.info("parameter : {}",password);

        Map<String, Object> response = new HashMap<>();
        // 파라미터로 받은 값 사용하기
        response.put("id", id);
        response.put("password", password);
        response.put("message", "안녕하세요. 로그인 페이지");
        response.put("date", new Date());
        return response;
    }



    @GetMapping("/logout")
    public String logout() {

        return "안녕하세요.로그아웃피이지 "+new Date() +"입니다. \n";

    }

}


//Json 데이터를 프론트에서 받아올 때 Map<String, Object> 타입으로 선언 하고 HashMap<String, Object> 사용
// String은 Json의 key 값,  Object는 Json의 value 값 (어떤 데이터가 들어올지 모르니까 Object최상위 타입으로 선언)
//인터페이스 Map 의 HashMap<String, Object> 구현체를 사용하는 이유는 빠른 검색과 중복되지 않는 값