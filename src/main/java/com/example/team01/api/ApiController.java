package com.example.team01.api;


import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// Pathvariable로 여러 경로를 할당해주는 역할을 하는 컨트롤러
//

@RestController
@RequestMapping("/api") // 공통 경로
public class ApiController {


//    @GetMapping("/test")
//    public String getTest() {
//        return "/api/test";
//    }


}
