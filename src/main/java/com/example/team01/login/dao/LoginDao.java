package com.example.team01.login.dao;

import com.example.team01.vo.LoginVO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface LoginDao {

    //로그인시 필요한 파라미터
    public LoginVO selectLogin(String clientId,String password);
    public LoginVO selectClientId(String clientId);
    public LoginVO selectRoleId(String roleId);
    public LoginVO selectLoginAll();

}

// 클라이언트가 보낸 로그인 정보에 대한 조회와 , 그에 대한 역할 확인


/*
* SELECT * FROM Users
* WHERE username = #{username} AND password = SHA256(#{password});

*
 *
* */