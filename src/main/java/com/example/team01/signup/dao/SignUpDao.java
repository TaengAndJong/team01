package com.example.team01.signup.dao;


import com.example.team01.vo.SignUpVO;

public interface SignUpDao {

    //회원가입 정보 추가
     int insertUserData(SignUpVO signUpVO);
     int selectDuplicateEmail(String email);
     int selectDuplicateId(String clientId);
     int selectDuplicateStaffId(String staffId);

    SignUpVO selectStaffInfo(String staffId);
}
