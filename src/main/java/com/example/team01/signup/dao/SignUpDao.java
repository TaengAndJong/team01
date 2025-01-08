package com.example.team01.signup.dao;


import com.example.team01.vo.SignUpVO;

public interface SignUpDao {

    //회원가입 정보 추가
    public int insertUserData(SignUpVO signUpVO);
    public int selectDuplicateId(String clientId);
    public int selectDuplicateStaffId(String staffId);
    public SignUpVO selectStaffInfo(String staffId);
}
