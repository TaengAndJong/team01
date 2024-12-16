package com.example.team01.admin;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
// api 는 localhost:port/api
// getMapping 은 localhost:port/api/test 다음의 경로 /test
//localhost:port/api/test/test
@RestController    //전역 ResponseBody
@RequestMapping("")
public class AdminController {

    @GetMapping("/admin")
    public String adminHandler() {

        return "안녕하세요.관리자 페이지 "+new Date() +"입니다. \n";

    }

    @GetMapping("/admin/test")
    public String testHandler() {

        return "안녕하세요.관리자페이지 테스트 "+new Date() +"입니다. \n";

    }

}
