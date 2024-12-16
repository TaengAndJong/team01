package com.example.team01.member;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;

@RestController    //전역 ResponseBody
@RequestMapping("")
public class MemberController {

    @GetMapping("/member")
    public String member() {
        return "멤버페이지 "+new Date() +"입니다. \n";

    }


}
