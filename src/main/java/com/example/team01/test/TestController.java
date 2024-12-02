package com.example.team01.test;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
// api 는 localhost:port/api
// getMapping 은 localhost:port/api/test 다음의 경로 /test
//localhost:port/api/test/test
@RestController    //전역 ResponseBody
@RequestMapping("/api")
public class TestController {


        @GetMapping("/test1/test")
        public String testHandler() {

            return "안녕하세요. 현재 서버시간1111은 "+new Date() +"입니다. \n";

        }

}
