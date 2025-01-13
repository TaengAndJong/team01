package com.example.team01.admin;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;

@RestController    //전역 ResponseBody
@RequestMapping("/admin")
public class AdminController {

    @GetMapping()
    public String adminHandler() {

        return "안녕하세요.관리자 페이지 "+new Date() +"입니다. \n";

    }

    @PostMapping
    public String adminHandler2() {

        return "안녕하세요.관리자 페이지 "+new Date() +"입니다. \n";

    }


    @GetMapping("/dashboard")
    public String testHandler() {
        String data ="안녕하세요.관리자페이지 테스트2222 "+new Date() +"입니다. \n";
        return data;

    }

}
