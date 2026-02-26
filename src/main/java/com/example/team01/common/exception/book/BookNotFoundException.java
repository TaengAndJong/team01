package com.example.team01.common.exception.book;

import java.util.List;


//도서삭제시 도서데이터 없을 경우 발생하는 예외
public class BookNotFoundException extends BookException {

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
