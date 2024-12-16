package com.example.team01.login;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;

@RestController    //전역 ResponseBody
@RequestMapping("")
public class LoginController {


    @GetMapping("/login")
    public String login() {

        return "안녕하세요. 로그인 페이지"+new Date() +"입니다. \n";

    }

    @GetMapping("/logout")
    public String logout() {

        return "안녕하세요.로그아웃피이지 "+new Date() +"입니다. \n";

    }

}
