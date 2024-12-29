package com.example.team01.signup;


import com.example.team01.signup.service.SignUpService;
import com.example.team01.vo.SignUpVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RequestMapping("/signUp") //전역 ResponseBody
@RequiredArgsConstructor(onConstructor = @__(@Autowired)) //final 타입 사용시 생성자 주입방식 사용
@RestController
public class SignUpController {

    //SignupSevice 주입
    private final SignUpService signUpService;

    BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();

    @GetMapping()
    public String getSignUp() {
        String data = " 회원가입  , getMapping";
        return data;
    }


    @PostMapping()
    public Map<String,Object> getInsert(@RequestBody SignUpVO joinUser) {

        log.info("joinUser-------------------: {}",joinUser.toString());
        log.info("joinUser222-------------------------: {}",joinUser);
        // 문자열 비밀번호 시큐리티에 맞게 암호화해주고
        String password = bCryptPasswordEncoder.encode(joinUser.getPassword());
        // 다시 설정하기
        joinUser.setPassword(password);
        log.info("password------------------: {}",password);
        try{
            //post요청으로 받아온 joinUser를 서비스에 파라미터로 넘겨주기
            signUpService.insertUserData(joinUser);

            return Map.of("message", "가입 성공: " + joinUser );

        }catch (Exception e){

            log.error("가입 실패: {}", e.getMessage());
            return Map.of("message", "로그인 실패: " + e.getMessage());

        }
//
    }
//
}
