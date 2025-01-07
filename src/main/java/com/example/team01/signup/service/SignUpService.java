package com.example.team01.signup.service;

import com.example.team01.vo.SignUpVO;

public interface SignUpService {

    public int insertUserData(SignUpVO signUpVO);
    public int selectDuplicateId(String clientId);
    public int selectDuplicateStaffId(String staffId);
}
