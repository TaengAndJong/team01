package com.example.team01.login.service;

import com.example.team01.login.dao.LoginDao;
import com.example.team01.vo.LoginVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;


@Slf4j
@RequiredArgsConstructor
@Service
public class LoginServiceImple implements LoginService {

    private final LoginDao loginDao;

    @Override
    public LoginVO selectLogin(String clientId, String password,String roleId) {

        log.info("selectLogin start:{} , password :{}, roleId: {}",clientId,password,roleId);

        LoginVO loginInfo =loginDao.selectLogin(clientId,password,roleId);

        log.info("loginInfo end:{}",loginInfo);

        return loginInfo;
    }

    @Override
    public LoginVO selectClientId(String clientId) {

        log.info("selectClientId start:{}",clientId);

        LoginVO loginInfo =loginDao.selectClientId(clientId);

        log.info("loginInfo end:{}",loginInfo);

        return loginInfo;
    }

//    @Override
//    public LoginVO selectRoleId(String roleId) {
//        return loginDao.selectRoleId(roleId);
//    }
}
