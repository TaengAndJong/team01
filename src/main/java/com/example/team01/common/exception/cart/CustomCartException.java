package com.example.team01.common.exception.cart;

import lombok.extern.slf4j.Slf4j;

/**
 * RuntimeException (unchecked Exception)
 * 예측이 불가능한 예외 상황처리, 강제적이지 않은 예외처리
 * 기본적으로 파라미터로 간단한 문자 메시지만 담을 수 있음!
 * **/

@Slf4j
public class CustomCartException extends RuntimeException {

    private final Long bookId;
    private final int stock;
    //초기화 해줄 생성자
    private CustomCartException(String message,Long bookId,int stock) {
            super(message);// runtimeException 상속받아오기
            this.bookId = bookId;
            this.stock = stock;
    }

    // static 팩토리 메서드로 타 클래스에서 직접 생성자를 호출하지 않고 클래스의 메서드만 호출해서 사용가능
    //static 메서드는 인스턴스에서 안 보임 ( e.get 안됨 , 클래스용 메서드)
    public static CustomCartException outOfStock(Long bookId,int stock) {
        log.info("booId:{},stock:{}-------------------", bookId,stock);

        return new CustomCartException("재고 수량  부족합니다.", bookId,stock);
    }


    //예외 발생시 어떤 도서인지 구분 
    public Long getBookId() {
        return bookId;
    } // 도서의 아이디
    public int getStock(){ return stock;} // 현재 도서 재고 수량
}
