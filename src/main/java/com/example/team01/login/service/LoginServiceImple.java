package com.example.team01.login.service;

import com.example.team01.login.dao.LoginDao;
import com.example.team01.vo.LoginVO;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;


@Slf4j

@Service
@Transactional
@RequiredArgsConstructor
public class LoginServiceImple implements LoginService {

    private final LoginDao loginDao;

    @Override
    public LoginVO selectLogin(String clientId, String password) {

        log.info("selectLogin start:{} , password :{}",clientId,password);

        LoginVO loginInfo = loginDao.selectLogin(clientId,password);


        return loginInfo;
    }

    @Override
    public LoginVO selectClientId(String clientId) {

        log.info("selectClientId start:{}",clientId);

        LoginVO loginInfo =loginDao.selectClientId(clientId);
        System.out.println("loginInfo: " + loginInfo);

        log.info("loginInfo end:{}",loginInfo);

        return loginInfo;
    }

    @Override
    public LoginVO selectLoginAll() {
        return loginDao.selectLoginAll();
    }

//    @Override
//    public LoginVO selectRoleId(String roleId) {
//        return loginDao.selectRoleId(roleId);
//    }
}
