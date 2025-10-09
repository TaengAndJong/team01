package com.example.team01.mypage.userInfo;


import com.example.team01.mypage.userInfo.dto.UserInfoDTO;
import com.example.team01.mypage.userInfo.service.UserInfoService;
import com.example.team01.vo.ClientVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/mypage")
@RestController
public class UserInfoController {

    private final UserInfoService userInfoService;


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

    @PutMapping("/changePassword")
    public ResponseEntity<?> updatePassword(@AuthenticationPrincipal UserDetails clientId, String password) {
        log.info("비밀번호 갱신 : ----------------- :{} 비밀번호 :{}",clientId,password);
        
        return ResponseEntity.ok("비밀번호 변경완료");
    }

}
