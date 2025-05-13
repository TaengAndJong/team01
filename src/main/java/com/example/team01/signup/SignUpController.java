package com.example.team01.signup;


import com.example.team01.common.service.ClientService;
import com.example.team01.signup.service.SignUpService;
import com.example.team01.vo.ClientVO;
import com.example.team01.vo.SignUpVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;


@Slf4j
@RequestMapping("/signUp") //전역 ResponseBody
@RequiredArgsConstructor(onConstructor = @__(@Autowired)) //final 타입 사용시 생성자 주입방식 사용
@RestController
public class SignUpController {

    //SignupService 주입
    private final SignUpService signUpService;
    private final ClientService clientService;

    BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();

    @PostMapping()
    public Map<String,Object> getInsert(@RequestBody SignUpVO joinUser) {

        log.info("joinUser-------------------: {}",joinUser);
        try {
            // 문자열 비밀번호 시큐리티에 맞게 암호화
            String password = bCryptPasswordEncoder.encode(joinUser.getPassword());
            // 비밀번호 다시 설정
            joinUser.setPassword(password);
            log.info("password------------------: {}", password);

            // `joinDate`를 현재 시간으로 설정
            joinUser.setJoinDate(LocalDateTime.now());
            // `status`를 기본값 "회원"으로 설정
            joinUser.setStatus("회원");

            // picture 가 null 이면 기본값 설정 (빈 byte 배열 또는 null 처리)
            if (joinUser.getPicture() == null) {
                joinUser.setPicture(new byte[0]); // 기본값으로 빈 byte 배열 설정
            }


            // 중복 ID 체크 (clientId, email, staffId 등)
            if (signUpService.selectDuplicateId(joinUser.getClientId()) > 0) {
                log.info("signUpService.selectDuplicateId(joinUser.getClientId()): {}", joinUser.getClientId());
                return Map.of("message", "이미 존재하는 아이디입니다.");
            }

            log.info("joinUser.getEmail() : {}",joinUser.getEmail());
            log.info("joinUser.getEmail() : {}",signUpService.selectDuplicateEmail(joinUser.getEmail()));

            if (signUpService.selectDuplicateEmail(joinUser.getEmail()) > 0) {


                return Map.of("message", "이미 존재하는 이메일입니다.");
            }

            // 중복이 없다면 데이터베이스에 저장
            signUpService.insertUserData(joinUser);

            // 성공 메시지
            return Map.of(
                    "success", true,
                    "message", "joinUser"+joinUser
            );

        } catch (Exception e) {
            log.error("가입 실패: {}", e.getMessage());
            return Map.of(
                    "success", false,
                    "message", "가입 실패: " + e.getMessage());
        }
    }


    @GetMapping()
    public String getSignUp() {
        String data = " 회원가입  , getMapping";
        return data;
    }




    @GetMapping("/validate")
    public Map<String,Object> checkUserInfo(@RequestParam(value = "clientId", required = false) String clientId,
                                            @RequestParam(value = "staffId", required = false) String staffId,
                                      @RequestParam(value = "email",required = false) String email) {
        log.info("idCheck------------------: {}",clientId);
        log.info("email------------------:{}", email);

        //json 형식 key 와 value 로 형식으로 바꿔주기위해 Map 사용
        Map<String, Object> response = new HashMap<>();

        // clientId 처리
        if (clientId != null) {
            checkDuplicate("clientId",clientId,response);
        }

        // staffId 처리
        if (staffId != null) {
            // 검증할 staffId가 넘어옴
            checkDuplicate("staffId",staffId,response);
        }

        //이메일 검증
        if(email != null){
            int isDuplicate =  signUpService.selectDuplicateEmail(email);
            log.info("isDuplicate --------:{}",isDuplicate);
            response.put("isDuplicate",isDuplicate);
        }

        log.info("response------------------: {}",response);

        return response;
    }



    //Function<T, R>는 Java 의 java.util.function 패키지에 포함된 람다식이나 메서드 참조를 사용할 수 있는 함수형 인터페이스
    //T: 입력 타입 (여기서는 String, 즉 ID 값)
    //R: 반환 타입 (여기서는 Integer, 즉 중복 여부)
    //즉, Function<String, Integer>는 "String 값을 입력받아 Integer 를 반환하는 함수"를 의미

   public void checkDuplicate(String key, String checkValue, Map<String, Object> response) {
            log.info("resposeEmail--- :{}",response);
            int isDuplicate;
            //check Value 가 있고
            if(checkValue != null) {
                // clientId 이면
                if(key.equals("clientId")) {
                    isDuplicate = signUpService.selectDuplicateId(checkValue);
                    log.info("isDuplicate-----checkValue--:{},{}",isDuplicate,checkValue);
                    response.put("isDuplicate", isDuplicate > 0);
                }
                // staffId 이면
                if(key.equals("staffId")) {
                    // 1. 존재하는 사원인지 검증 ( EMP에서 )
                    SignUpVO staffInfo =signUpService.selectStaffInfo(checkValue);
                    // 2. 조회한 사원 번호가 있으면, 클라이언트 테이블에서 동일한 사원번호가 있는지 확인
                    if(staffInfo != null) {
                        //2. 회원가입이 되어있는 회원인지 확인 (CLIENT에서)
                        // 조회가 있으면 중복되었끼 때문에 중복응답보내기
                        isDuplicate =  clientService.selectDuplicateClientStaff(checkValue);
                        log.info("isDuplicate-----checkValue--:{},{}",isDuplicate,checkValue);

                        // 중복 여부 반환
                        if (isDuplicate > 0) {
                            response.put("isDuplicate", true);  // 중복된 사원번호가 있으면 true
                        } else {
                            response.put("isDuplicate", false);  // 중복된 사원번호가 없으면 false
                            response.put("staffInfo", staffInfo);
                            log.info("22222-------------:{}",staffInfo);
                        }

                    //
                    }
                    //If end

                }
                //staff If end
            }
    //if end
   }

// checkduplicate end
}
