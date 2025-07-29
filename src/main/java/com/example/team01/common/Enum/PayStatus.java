package com.example.team01.common.Enum;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/*
* Enum= 열거형, 미리 정해진 상수값들의 집합으로 변하지 않는 값
*
* READY  ,  COMPLETE, FAIL // 단순한 열거형(상수 선언)
*
* */




@Getter
@RequiredArgsConstructor // final필드를 매개변수로 받는 생성자를 자동으로 생성해줌
public enum PayStatus {
    //READY("READY", "결제 대기"),
    //FAILED("FAILED", "결제 실패"),
    COMPLETED("COMPLETED", "결제완료"),//status, message
    CANCELALL("CANCELALL","전체결제취소"),
    CANCELPARTIAL("PARTIAL","부분취소");

    private final String status;
    private final String message;


}
