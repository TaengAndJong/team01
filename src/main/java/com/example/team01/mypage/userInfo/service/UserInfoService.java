package com.example.team01.mypage.userInfo.service;

import com.example.team01.mypage.userInfo.dto.PasswordDTO;
import com.example.team01.mypage.userInfo.dto.UserInfoDTO;


public interface UserInfoService {

     //개인정보 조회
     UserInfoDTO selectClientInfo(String clientId, String roleId);

     //새로운 비밀번호로 변경
     int upatePassword(String clientId,String newPassword);

}
