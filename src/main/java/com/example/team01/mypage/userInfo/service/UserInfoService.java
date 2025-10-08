package com.example.team01.mypage.userInfo.service;

import com.example.team01.mypage.userInfo.dto.UserInfoDTO;


public interface UserInfoService {

     UserInfoDTO selectClientInfo(String clientId, String roleId);
}
