package com.example.team01.signup;


import com.example.team01.signup.dto.auth.ClientIdConfirmRequest;
import com.example.team01.signup.dto.staff.StaffConfirmRequest;
import com.example.team01.signup.service.SignUpService;
import com.example.team01.vo.SignUpVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;


@Slf4j
@RequestMapping("/signup") //전역 ResponseBody
@RequiredArgsConstructor() //final 타입 사용시 생성자 주입방식 사용
@RestController
public class SignUpController {


/*
* 컨트롤러는 서비스 호출만 하고, 예외 발생 시 글로벌 예외 핸들러가 처리 (컨트롤러에서 별도 반환 처리 안 함)
* */

    //SignupService 주입
    private final SignUpService signUpService;
    //시큐리티 컨피그에 이미 비크립트 패스워드 인코더 객체가 빈으로 등록되어있기때문에 새로 생성 금지
    //새로 생성하면 로그인 시 DaoAuthenticationProvider의 passwordEncoder와 불일치로 인증 실패 발생
    private final PasswordEncoder passwordEncoder;


    @PostMapping()
    public ResponseEntity<?> getInsert(@RequestBody SignUpVO joinUser) {

        if (joinUser == null) { //1차 회원가입 객체 null 검증
            throw new IllegalArgumentException("요청 데이터가 없습니다."); // 글로벌 핸들러로 예외를 전달해 처리
        }

        log.info("joinUser-------------------: {}",joinUser);
        //중복과 필수값 검증(예외 발생 시 여기서 예외 던짐)
        signUpService.selectDuplicateId(joinUser.getClientId());
        
        //문제 없으면 비밀번호 암호화 (시큐리티 컨피그에 처리 정책 스프링빈으로 등록 됨)
        String password = passwordEncoder.encode(joinUser.getPassword());
        joinUser.setPassword(password);

        //기본값 설정해주기
        joinUser.setJoinDate(LocalDateTime.now());
        joinUser.setStatus("회원");

        //서비스로 회원가입 정보 전달
        signUpService.insertUserData(joinUser);

        //insert 성공하면
        return ResponseEntity.ok(
                Map.of("success", true, "message", "가입 완료")
        );
    }


    //아이디중복검증 API
    @PostMapping("/idConfirm")
    public ResponseEntity<?>  confirmId(@RequestBody ClientIdConfirmRequest resp) {

        log.info("validInfo------------- 회원가입 객체 검증:{}",resp);

        if (resp.getClientId() != null) {
            log.info("아이디 중복 검증 진입");
            signUpService.selectDuplicateId(resp.getClientId()); //예외가 발생하지 않으면 다음코드 실행
            //각 객체의 성공여부 분기처리를 위해 type을 지정해서 응답에 보내줌
            return ResponseEntity.ok(
                    Map.of("success", true, "type", "CLIENTID")
            );
        }

        // if문 이외라면 400에러 반환
        return ResponseEntity.badRequest().build();
    }

    //사원검증  API
    @PostMapping("/staffConfirm")
      public ResponseEntity<?> confirmStaff(@RequestBody StaffConfirmRequest staffInfo){
            log.info("사원번호 검증:{}",staffInfo);
            //사원번호가 존재하는 지 우선 조회 -> 없으면 예외 처리 필요

        return  null;
      }


}
