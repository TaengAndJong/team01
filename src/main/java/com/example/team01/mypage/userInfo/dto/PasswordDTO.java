package com.example.team01.mypage.userInfo.dto;


import lombok.Data;

@Data
public class PasswordDTO {

    String clientId;// 조회, 갱신  해당 유저 조회 파라미터
    String newPassword; // 새로운 변경 비밀번호
    String currentPw; // 현재비밀번호

}
