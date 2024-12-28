package com.example.team01.index;


import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// api 는 localhost:port/api
// getMapping 은 localhost:port/api 다음의 경로 /test
//localhost:port/api/test


@Slf4j
@RestController
@RequestMapping()
public class IndexController {

    //getMapping index 페이지 명시적으로 해주지 않으면 데이터 전송에 충돌 생길 수 있음!
    @GetMapping("/")
    public String index() {
        String data= "main";
        return data;
    }

    @GetMapping("/api")
    public String indexAPI() {
        String data= "apiMain";

        return data;
    }


}
