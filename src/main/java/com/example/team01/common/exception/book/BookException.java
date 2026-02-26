package com.example.team01.common.exception.book;

import com.example.team01.common.exception.common.BusinessException;
/*
도서관련 예외를 공통으로 처리하기 위한 RuntimeException > BusinessException을 상속 받은 부모예외 클래스
**/



public class BookException extends BusinessException {

    public BookException(String message) {
        super(message);
    }

}
