package com.example.team01.login.service;

import com.example.team01.vo.LoginVO;

public interface LoginService {

    public LoginVO selectLogin(String clientId, String password,String roleId);
    public LoginVO selectClientId(String clientId);
   // public LoginVO selectRoleId(String roleId);

}
