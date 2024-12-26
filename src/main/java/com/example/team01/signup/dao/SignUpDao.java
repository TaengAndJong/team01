package com.example.team01.signup.dao;

import com.example.team01.vo.SignUpVO;

public interface SignUpDao { // DB를 사용해 데이터를 조회 or 조작 기능 전담 오브젝트

    public void insertUserData(SignUpVO userData); // 사용자 정보 db 저장

    public boolean checkId(String userId); // db 회원 id 조회 (id 중복확인)

    public SignUpVO getUserInfo(String Id); // id로 특정 사용자 정보 조회

    // 회원 상태 업데이트
    // 회원 탈퇴

}
