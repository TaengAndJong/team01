package com.example.backend.test.controller;

import javax.inject.Inject;

import com.example.backend.test.service.TestService;
import com.example.backend.vo.TestVO;

public class TestController {
    //service 주입 : @Inject는 직접 객체를 생성하지 않고 사용하게 해줌
    @Inject
    TestService service;
    
    TestVO mokdata = new TestVO();

    // 스프링 어노테이션 적용 확인하기
    

    // //test용 VO 객체
    // TestVO test = service.addTest(mokdata);

}
