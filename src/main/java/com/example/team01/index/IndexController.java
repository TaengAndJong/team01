package com.example.team01.controller;


import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
// api 는 localhost:port/api
// getMapping 은 localhost:port/api 다음의 경로 /test
//localhost:port/api/test


@RestController    //전역 ResponseBody + controller
public class IndexController {

    @RequestMapping("/")
    public String testHandler() {

        return "안녕하세요gg. 현재 서버시간은 "+new Date() +"입니다. \n";

    }

}
