package com.example.backend.test.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.backend.vo.TestVO;

// void 로 선언하는 메소드와 VO 객체의 타입으로 선언하는 메소드의 차이
// TestVO 객체를 데이터베이스에 저장하는 역할일 경우, 반환값이 필요없기 때문에 void로 선언하며, insert,delete,update는 void로 처리

//특정 데이터를 조회할 때는 데이터베이스에 갔다가 다시 반환된 데이터를 가지고 사용자에게 전달해줘야하기 때문에 반환 데이터가 있을 경우에는 VO 객체 타입으로 지정

//결론 사용자에서 데이터베이스로, 단방향일 경우에는 void로 지정
//양방향일 경우에는 사용자 -> 데이터베이스 -> 사용자 의 과정으로 데이터베이스에서 반환된 객체를 받아서 사용자로 가야하기 때문에 VO객체 타입을 선언해준다.

//Mapper 클래스 파일과 Dao 파일은 동일한 역할을 하며, @Mapper 어노테이션을 사용해서 MyBatis가 TestDao 인터페이스를 Mapper로 인식하도록 해줌

@Mapper
public interface TestDao {

    //DB에 insert할 메소드
    // 매개변수를 TestVO 타입으로 지정하면 TestVO에 담긴 모든 객체를 인자로 받을 수 있음 TestVO는 row를 의미함 
    void insetTest(TestVO test);
    //DB에 Update할 메소드
    void updateTest(TestVO test);
    //DB에 delete할 메소드
    void deleteTest(String testId);

    //DB에 select할 메소드(특정데이터 조회)
    TestVO selectOne(String testId);
    // DB에 조건없이 전체 조회 (행이 여러개니까 List로 받아야 함)
    List<TestVO> selectAll();

}

//Dao 인터페이스 구현 후 Mapper.xml 작성하러 가기