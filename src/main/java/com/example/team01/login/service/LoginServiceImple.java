package com.example.team01.login.service;

import com.example.team01.login.dao.LoginDao;
import com.example.team01.vo.LoginVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;


@Slf4j
@Service
@RequiredArgsConstructor
public class LoginServiceImple implements LoginService{

    private final LoginDao loginDao;

    //비밀번호 암호와 , 빈으로 등록하면 어디서든지 가져다 사용가능


    @Override
    public LoginVO selectLogin(String clientId, String password) {

        log.info("selectLogin start:{} , password :{}",clientId,password);

        LoginVO loginInfo = loginDao.selectLogin(clientId,password);


        return loginInfo;
    }

    @Override
    public LoginVO selectClientId(String clientId) {

        LoginVO loginInfo =loginDao.selectClientId(clientId);

        log.info("loginInfo end:{}",loginInfo);

        return loginInfo;
    }

    @Override
    public LoginVO selectLoginAll() {
        return loginDao.selectLoginAll();
    }



}
//https://velog.io/@wlgns3855/Spring-Security-%EC%8A%A4%ED%94%84%EB%A7%81-%EC%8B%9C%ED%81%90%EB%A6%AC%ED%8B%B0%EB%A1%9C-%EB%A1%9C%EA%B7%B8%EC%9D%B8-%EA%B8%B0%EB%8A%A5-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0