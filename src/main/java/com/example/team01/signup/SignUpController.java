package com.example.team01.signup;


import com.example.team01.common.service.ClientService;
import com.example.team01.signup.service.SignUpService;
import com.example.team01.vo.ClientVO;
import com.example.team01.vo.SignUpVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Slf4j
@RequestMapping("/signup") //전역 ResponseBody
@RequiredArgsConstructor() //final 타입 사용시 생성자 주입방식 사용
@RestController
public class SignUpController {

    //SignupService 주입
    private final SignUpService signUpService;


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
                    "message", "가입 완료"
            );

        } catch (Exception e) {
            log.error("가입 실패: {}", e.getMessage());
            return Map.of(
                    "success", false,
                    "message", "가입 실패");
        }
    }


    @GetMapping()
    public String getSignUp() {
        String data = " 회원가입  , getMapping";
        return data;
    }



    //String 타입 (문자열) 로 받을 때는 @ModelAttribute를 사용해서 하나의 객체로 파라미터를 받아올 수 있음
    @GetMapping("/validate")
    public Map<String,Object> checkUserInfo(@RequestParam(name="clientId", required = false) String clientId,
                                            @RequestParam(name="staffId", required = false) String staffId,
                                            @RequestParam(name="tel", required = false) String tel,
                                            @RequestParam(name="clientName", required = false) String clientName) {

        // 클라이언트에서 받아오는 검증할 데이터들
        log.info("getClientId: {}",clientId);


        //json 형식 key 와 value 로 형식으로 바꿔주기위해 Map 사용 ==> 클라이언트로 보내는 결과값
        Map<String, Object> response = new HashMap<>();

        // 1. clientId 중복 여부 확인
        if (clientId != null) {
            Map<String, Object> clientMap = Map.of("clientId", clientId);
            boolean isDuplicate = checkDuplicate(clientMap);
            log.info("isDuplicate: {}", isDuplicate);//true
          //  log.info("isDuplicate: {}", !isDuplicate);//false

            if(isDuplicate) { //true
                response.put("message", "아이디가 중복되었습니다."); // true = 사용 가능
            }else{//false
                response.put("message", "사용가능한 아이디입니다.");
            }
        }

        // 2. staffId 존재 여부 확인
//        if (staffId != null) {
//            Map<String, Object> staffMap = new HashMap<>();
//            staffMap.put("staffId", staffId);
//            if (clientName != null && tel != null) {
//                staffMap.put("staffName", clientName);
//                staffMap.put("tel", tel);
//            }
//            boolean isExist = checkDuplicate(staffMap);
//            log.info("isExist: {}", isExist);
//            response.put("success", isExist); // true = 존재함
//        }

        return response;
    }



    //Function<T, R>는 Java 의 java.util.function 패키지에 포함된 람다식이나 메서드 참조를 사용할 수 있는 함수형 인터페이스
    //T: 입력 타입 (여기서는 String, 즉 ID 값)
    //R: 반환 타입 (여기서는 Integer, 즉 중복 여부)
    //즉, Function<String, Integer>는 "String 값을 입력받아 Integer 를 반환하는 함수"를 의미

   public boolean checkDuplicate(Map<String,Object> checkValue) {

        log.info("checkValue--------------:{}",checkValue);

        //중복 조회결과 타입 1(true),0(false)
        int isDuplicate;

        boolean result = false;

        if (checkValue.get("clientId") != null) {
           String clientId = (String) checkValue.get("clientId");
           isDuplicate = signUpService.selectDuplicateId(clientId);
           log.info("isDuplicate--clientId:{}",isDuplicate);
            if(isDuplicate > 0){
                result = true; //중복아이디 있음
            }
        }

//        if(checkValue.get("staffId") != null){
//            String staffId = (String) checkValue.get("staffId");
//            String staffName = (String) checkValue.get("staffName");
//            String tel = (String) checkValue.get("tel");
//            isDuplicate = signUpService.selectDuplicateStaffId(staffId, staffName, tel); // 여기서 계속 0이 반환됨
//            log.info("staffId 컨트롤러 :{}",isDuplicate); //0이 반환되는데
//            if(isDuplicate > 0){
//                result = true;//검색된 회원 있음
//            }
//        }

       return result; // 어떤 값도 없으면 그냥 false 반환
    }

// checkduplicate end
}
