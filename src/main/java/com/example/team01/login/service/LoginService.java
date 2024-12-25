package com.example.team01.login.service;

import com.example.team01.security.CustomUserDtails;
import com.example.team01.vo.LoginVO;


public interface LoginService {

    public LoginVO selectLogin(String clientId, String password);
    public LoginVO selectClientId(String clientId);
    public LoginVO selectLoginAll();
   // public LoginVO selectRoleId(String roleId);

}
