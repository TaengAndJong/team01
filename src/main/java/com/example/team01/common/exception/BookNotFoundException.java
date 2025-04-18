package com.example.team01.common.exception;

import java.util.List;

/**
 * RuntimeException (unchecked Exception)
 * 예측이 불가능한 예외 상황처리, 강제적이지 않은 예외처리
 * 기본적으로 파라미터로 간단한 문자 메시지만 담을 수 있음!
 * **/
//도서삭제시 도서데이터 없을 경우 발생하는 예외
public class BookNotFoundException extends RuntimeException {

    //데이터가 불일치할 경우, 불일치한 도서 아이디를 담아 줄 변수
    private final List<String> missingIds;

    public BookNotFoundException(String message, List<String> missingIds) {
        super(message);
        this.missingIds = missingIds;
    }

    public List<String> getMissingIds() {
        return missingIds;
    }
}
