package com.example.team01.signup;


import com.example.team01.signup.service.SignUpService;
import com.example.team01.vo.SignUpVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

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

    @GetMapping("/checkDuplicate")
    public Map<String,Object> idCheck(@RequestParam(value = "clientId", required = false) String clientId,
                                      @RequestParam(value = "staffId", required = false) String staffId) {
        log.info("idCheck------------------: {}",clientId);
        log.info("staffIdCheck------------------:{}", staffId);

        //json형식 key와 value로 형식으로 바꿔주기위해 Map 사용
        Map<String, Object> response = new HashMap<>();

        // clientId 처리
        if (clientId != null) {
             checkDuplicate("clientId",clientId,response);
        }

        // staffId 처리
        if (staffId != null) {
            checkDuplicate("staffId",staffId,response);
        }

        return response;
    }

    //Function<T, R>는 Java의 java.util.function 패키지에 포함된 람다식이나 메서드 참조를 사용할 수 있는 함수형 인터페이스
    //T: 입력 타입 (여기서는 String, 즉 ID 값)
    //R: 반환 타입 (여기서는 Integer, 즉 중복 여부)
    //즉, Function<String, Integer>는 "String 값을 입력받아 Integer를 반환하는 함수"를 의미

   public void checkDuplicate(String key, String checkValue, Map<String, Object> response) {

            int isDuplicate;
            //checkValue가 있고
            if(checkValue != null) {
                // clientId 이면
                if(key.equals("clientId")) {
                    isDuplicate = signUpService.selectDuplicateId(checkValue);
                    log.info("isDuplicate-----checkValue--:{},{}",isDuplicate,checkValue);
                    response.put("isDuplicate", isDuplicate > 0);


                }
                // staffId 이면
                if(key.equals("staffId")) {
                    isDuplicate = signUpService.selectDuplicateStaffId(checkValue);
                    log.info("isDuplicate-----checkValue--:{},{}",isDuplicate,checkValue);
                    response.put("isDuplicate", isDuplicate > 0);

                }
            }


   }

//
}
