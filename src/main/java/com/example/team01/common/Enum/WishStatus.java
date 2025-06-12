package com.example.team01.common.Enum;


// 열거형 클래스 Enum, 기본 선언 타입이 public static final이기 때문에 클래스명을 바로 사용가능
// 사용하는 이유는 한정된 상태값을 처리할 때 명확한 상태값 표현가능, 유지보수 용이
public enum WishStatus {

    INSERT("찜목록 추가완료"),
    UPDATE("찜목록 상태변경완료"),
    FAIL("처리 실패");

    private String msg;

    WishStatus(String msg){
        this.msg=msg;
    }

    public String getMsg(){
        return msg;
    }

}
