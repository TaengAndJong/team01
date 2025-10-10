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
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/mypage")
@RestController
public class UserInfoController {

    private final UserInfoService userInfoService;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;


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

        if (bCryptPasswordEncoder.matches(dto.getCurrentPw(), currentPassword)) {
            log.info("비밀번호 일치 -----------------");
            return ResponseEntity.ok("비밀번호 일치");

        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("비밀번호 불일치");
        }

    }


    @PutMapping("/changePassword")
    public ResponseEntity<?> updatePassword(@AuthenticationPrincipal UserDetails clientId,@RequestBody PasswordDTO dto) {
        log.info("비밀번호 갱신 : ----------------- :{} 비밀번호 :{}",clientId,dto);
        
        return ResponseEntity.ok("비밀번호 변경완료");
    }

}
