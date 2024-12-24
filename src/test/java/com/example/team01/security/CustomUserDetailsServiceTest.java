package com.example.team01.security;


import com.example.team01.login.dao.LoginDao;
import com.example.team01.vo.LoginVO;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import static org.junit.jupiter.api.Assertions.*;

@Slf4j
@Service
@SpringBootTest
public class CustomUserDetailsServiceTest{

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Autowired
    private LoginDao loginDao;


    void  loadUserByUsernameTest(){

        String clientId = "user01";

        // clientId로 사용자 정보 조회
        LoginVO user = loginDao.selectClientId(clientId);



        log.info("loginInfo:{}", user);


        // loadUserByUsername 메서드 실행
        UserDetails userDetails = customUserDetailsService.loadUserByUsername(clientId);

        assertNotNull(userDetails);
        assertEquals(clientId, userDetails.getUsername());


    }

    @Test
    void loadUserByUsername_ShouldThrowUsernameNotFoundException() {
        // 존재하지 않는 clientId
        String clientId = "nonExistentUser";

        assertThrows(UsernameNotFoundException.class, () -> {
            customUserDetailsService.loadUserByUsername(clientId);
        });
    }



}

