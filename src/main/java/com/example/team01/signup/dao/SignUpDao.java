package com.example.team01.signup.dao;


import com.example.team01.signup.dto.staff.StaffConfirmRequest;
import com.example.team01.vo.SignUpVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;



/*
* 자바의 추상화에는 Abstract Class와 Interface 가 있고,
* 인터페이스에 선언된 변수는 자동으로 public final static이 붙어 상수처리가 되며,
* 인터페이스에 선언된 메서드는 public abstract가 붙어 추상 메서드가 됨
* static 또는 default 메서드는 직접 명시해야 함
* 
* 메서드에 final을 선언 하지 않는 이유는 final 선언시 불변하는 상수로 처리하기때문에 오버라이딩이 불가능해짐
* Dao의 구현체는 런타임 시에 MyBatis가 프록시 객체를 생성해 Mapper를 실제 구현체처럼 동작하게 해준다.
* */


@Mapper
public interface SignUpDao {

    //회원가입 정보 추가
     int insertUserData(SignUpVO signUpVO);
     int selectDuplicateEmail(String email);
     int selectDuplicateId(String clientId);
     int selectDuplicatePhoneNumber(String tel);
    boolean selectStaffInfo(StaffConfirmRequest staff);
}
