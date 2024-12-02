package com.example.team01.test2;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;

@RestController    //전역 ResponseBody
@RequestMapping("/api/test2")
public class TestController2 {


        @GetMapping("/test")
        public String testHandler() {

            return "안녕하세요. 현재 서버시222간은 "+new Date() +"입니다. \n";

        }

}
