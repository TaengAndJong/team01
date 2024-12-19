package com.example.team01.login.dao;

import com.example.team01.vo.LoginVO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface LoginDao {

    //로그인시 필요한 파라미터
    public LoginVO selectAdminLogin(String clientId,String password);
}

/*
* SELECT * FROM Users
* WHERE username = #{username} AND password = SHA256(#{password});

 *
* */