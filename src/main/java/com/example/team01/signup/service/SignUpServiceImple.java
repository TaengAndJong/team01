package com.example.team01.signup.service;

import com.example.team01.signup.dao.SignUpDao;
import com.example.team01.vo.SignUpVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;


@Slf4j
@RequiredArgsConstructor
@Service
public class SignUpServiceImple implements SignUpService {

    private final  SignUpDao dao;

    @Override
    public int insertUserData(SignUpVO signUpVO) {
        // mybatis는 insert, delete, update는 성공여부 숫자로 반환
        int cnt;
        if (signUpVO != null) {
            log.info("insert user data:{}", signUpVO );
            log.info("insert user dao:{}", dao.insertUserData(signUpVO));
            return cnt = dao.insertUserData(signUpVO);
        }
        return 0;

    }

    @Override
    public int selectDuplicateId(String clientId) {
        int cnt;
        if (clientId != null) {
            log.info("insert user data:{}", clientId );
            log.info("insert user dao:{}", dao.selectDuplicateId(clientId));
            return cnt =  dao.selectDuplicateId(clientId);
        }
        return 0;
    }
}
