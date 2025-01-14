package com.example.team01.logout;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;

@RequestMapping("/logout")
@RestController
public class LogoutController {


    @GetMapping()
    public String getLogout() {
        // 로그아웃 페이지 및 /api로 리다이렉트 해주기
        return "안녕하세요.로그아웃피이지 "+new Date() +"입니다. \n";
    }



    @PostMapping()
    public String postLogout() {
        // 로그아웃 페이지 및 /api로 리다이렉트 해주기
        return "안녕하세요.로그아웃피이지 "+new Date() +"입니다. \n";
    }



}
