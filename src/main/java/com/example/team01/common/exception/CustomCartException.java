package com.example.team01.common.exception;

/**
 * RuntimeException (unchecked Exception)
 * 예측이 불가능한 예외 상황처리, 강제적이지 않은 예외처리
 * 기본적으로 파라미터로 간단한 문자 메시지만 담을 수 있음!
 * **/

public class CustomCartException extends RuntimeException {

    private final String bookId;

    //초기화 해줄 생성자
    private CustomCartException(String message,String bookId) {
            super(message);// runtimeException 상속받아오기
            this.bookId = bookId;
    }

    // static 팩토리 메서드로 타 클래스에서 직접 생성자를 호출하지 않고 클래스의 메서드만 호출해서 사용가능
    public static CustomCartException outOfStock(String bookId) {
        return new CustomCartException("재고 수량이 없습니다", bookId);
    }

    //예외 발생시 어떤 도서인지 구분 
    public String getBookId() {
        return bookId;
    }
}
