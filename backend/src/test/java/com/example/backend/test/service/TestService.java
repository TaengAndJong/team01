package com.example.backend.test.service;

import java.util.List;

import com.example.backend.vo.TestVO;

//Service 인터페이스와 구현체를 작성하는 이유 : 
// 1) 역할 분리  : 비즈니스 로직(Service)과 데이터 접근 로직(Dao)을 분리하여 응집도를 높이고 유지보수를 용이하게 만들기 위함.
// 2) 코드의 재사용성 : Service는 DAO 호출뿐 아니라 비즈니스 요구사항에 맞게 로직을 추가
// 3) 유연성 확장 : mock 객체(test용 데이터) 를 사용하여 단위 테스트 작성가능

// ***4) service 구현 로직에서 null 값 대신 예외를 던지거나 기본값을 반환할 수 있으며, 데이터를 가공, 비즈니스 로직 추가 가능

public interface TestService {
//Service 인터페이스를 작성할 때 일반적으로 Dao와 동일한 메소드 타입과 파라미터(인자)로 작성하면 됨! 

    //데이터를 DB에 삽입 
    void addTest(TestVO test);
    //데이터를 업데이트
    void modifyTest(TestVO test);
    //데이터를 삭제
    void removeTest(String testId);
    //특정 데이터를 조회
    TestVO getSelectOne(String testId);
    //모든 데이터를 조회
    List<TestVO> getSelectAll();


}
// 작성완료 후 ServiceImple 구현체 작성하기 ==> 비즈니스 로직작성