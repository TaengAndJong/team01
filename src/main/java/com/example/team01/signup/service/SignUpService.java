package com.example.team01.signup.service;

import com.example.team01.vo.SignUpVO;

public interface SignUpService {

    void insertUserData(SignUpVO signUpVO);
    void  selectDuplicateId(String clientId);
    SignUpVO selectStaffInfo(String staffId);

}
