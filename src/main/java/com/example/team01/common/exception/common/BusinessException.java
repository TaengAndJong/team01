package com.example.team01.common.exception.common;


/*
RuntimeException (unchecked Exception)
예측이 불가능한 예외 상황처리, 강제적이지 않은 예외처리
기본적으로 파라미터로 간단한 문자 메시지만 담을 수 있음!
* */

public class BusinessException extends RuntimeException {

    public BusinessException(String message) {
        super(message); // 런타임예외를 상속받고 있어서 선언만 해주면 됨
    }
    // 새로 커스텀하려면, 클래스변수를 선언하고 
    // 기존 부모로부터 상속받은 message 파라미터와 새로운 파라미터를 사용한 
    // 생성자를 만들어주고 , 비즈니스 로직에서 접근 할 수 있도록 getter를 작성해준다

}
