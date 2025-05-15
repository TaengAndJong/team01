package com.example.team01.signup.service;

import com.example.team01.vo.SignUpVO;

public interface SignUpService {

    int insertUserData(SignUpVO signUpVO);
    int selectDuplicateId(String clientId);
    //int selectDuplicateStaffId(String staffId,String staffName,String tel);
    SignUpVO selectStaffInfo(String staffId);
    int selectDuplicateEmail(String email);
}
