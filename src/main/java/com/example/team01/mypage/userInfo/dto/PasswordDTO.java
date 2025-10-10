package com.example.team01.mypage.userInfo.dto;


import lombok.Data;

@Data
public class PasswordDTO {

    String newPassword; // 새로운 변경 비밀번호
    String currentPw; // 현재비밀번호

}
