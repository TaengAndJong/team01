package com.example.team01.signup.dao;


import com.example.team01.vo.SignUpVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface SignUpDao {

    //회원가입 정보 추가
     int insertUserData(SignUpVO signUpVO);
     int selectDuplicateEmail(String email);
     int selectDuplicateId(String clientId);
//     int selectDuplicateStaffId(@Param("staffId") String staffId,
//                                @Param("staffName") String staffName,
//                                @Param("tel") String tel);
     SignUpVO selectStaffInfo(String staffId);
}
