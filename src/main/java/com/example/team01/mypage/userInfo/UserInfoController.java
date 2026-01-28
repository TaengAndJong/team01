package com.example.team01.mypage.userInfo;


import com.example.team01.mypage.userInfo.dto.PasswordDTO;
import com.example.team01.mypage.userInfo.dto.UserInfoDTO;
import com.example.team01.mypage.userInfo.service.UserInfoService;
import com.example.team01.vo.ClientVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/mypage")
@RestController
public class UserInfoController {

    private final UserInfoService userInfoService;
    private final PasswordEncoder passwordEncoder;
    // 회원가입 시, PasswordEncoder를 구현한 Bcrypt 알고리즘으로 암호화 (인터페이스와 구현체 분리)


    @GetMapping("/userInfo")
    public ResponseEntity<?> getUserInfo(@AuthenticationPrincipal UserDetails user) {

        log.info("user ------들어오나 요청이:{}",user);
        String clientId = user.getUsername();
        String roleId = user.getAuthorities().iterator().next().getAuthority();
        log.info("user ClientId : {}, role :{}",clientId,roleId);
        // 역할과 아이디로 데이터 조회해오기
        UserInfoDTO result =  userInfoService.selectClientInfo(clientId,roleId);
        log.info(" 사용자 정보 반환: {}",result);

        return ResponseEntity.ok(result);
    }

    @PostMapping("/checkPassword")
    public ResponseEntity<?> checkCurrentPassword(@AuthenticationPrincipal UserDetails user, @RequestBody PasswordDTO dto) {
        log.info("현재비밀번호 확인 : ----------------- :{} 비밀번호 :{}",user,dto);

        //데이터베이스에서 현재 로그인한 유저의 암호화된 비밀번호 가져오기
        String currentPassword =user.getPassword(); // DB 저장된 암호화된 비밀번호
        log.info("currentPassword:{}",currentPassword);
        //결과를 담아줄 맵 객체
        Map<String,Object> result = new HashMap<>();

        //passwordEncoder의 matches 메소드를 통한 요청받아온 날데이터와 암호화되어 저장된 비밀번호 비교
        if (passwordEncoder.matches(dto.getCurrentPw(), currentPassword)) {
            log.info("비밀번호 일치 -----------------");
            result.put("success",true);
            result.put("msg","현재 비밀번호 확인완료");
            return ResponseEntity.ok(result);

        } else {
            result.put("success",false);
            result.put("msg","현재 비밀번호가 일치하지 않습니다.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
        }

    }


    @PutMapping("/changePassword")
    public ResponseEntity<?> updatePassword(@AuthenticationPrincipal UserDetails user,@RequestBody PasswordDTO dto) {
        log.info("비밀번호 갱신 : ----------------- 인증객체 :{} dto :{}",user,dto);
        String clientId = user.getUsername();
        String currentPassword = dto.getNewPassword();
        log.info("clientId : {},currentPassword:{}",clientId,currentPassword);

        //서비스로 파라미터 전달
        int updateResult = userInfoService.upatePassword(clientId,currentPassword);
        log.info("비밀번호 갱신 결과 000 :{}",updateResult);

        //결과를 담아줄 맵 객체
        Map<String,Object> result = new HashMap<>();

        if (updateResult > 0) {
            result.put("success",true);
            result.put("msg","비밀번호 변경완료");
            return ResponseEntity.ok(result);
        } else {
            result.put("success",false);
            result.put("msg","비밀번호 변경실패");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
        }

    }

    @PutMapping("/updateAllInfo")
    public ResponseEntity<?> updateAllInfo(@AuthenticationPrincipal UserDetails user,@RequestBody UserInfoDTO userInfoDTO) {

        log.info("비밀번호를 제외한 변경된 정보: {}", userInfoDTO);
        //서버스로 넘겨주기
        int updateAllResult = userInfoService.updateAllUserInfo(userInfoDTO);

        //결과를 담아줄 맵 객체
        Map<String, Object> result = new HashMap<>();

        if (updateAllResult > 0) {
            result.put("success", true);
            result.put("msg", "개인정보 수정완료");
            return ResponseEntity.ok(result);
        } else {
            result.put("success", false);
            result.put("msg", "개인정보 수정실패");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
        }
    }
}
