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
@RequiredArgsConstructor()
@RestController
public class LoginController {


    @GetMapping()
    public String getLogin() {
        String data = "로그인 페이지 , getMapping";
        return data;
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