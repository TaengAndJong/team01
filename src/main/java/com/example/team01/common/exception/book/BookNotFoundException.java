package com.example.team01.common.exception.book;

import java.util.List;


//도서삭제시 도서데이터 없을 경우 발생하는 예외
public class BookNotFoundException extends BookException {

    //데이터가 불일치할 경우, 불일치한 도서 아이디를 담아 줄 변수
    private final List<Long> missingIds;

    //다건
    public BookNotFoundException(String message, List<Long> missingIds) {
        super(message);
        this.missingIds = missingIds;
    }

    // 단건 --- overloaing
    public BookNotFoundException(String message, Long bookId) {// 단일 파라미터로 받아서
        super(message);
        this.missingIds = List.of(bookId); // 값을 List<Long> 형태로 바꿔 줌
    }


    public List<Long> getMissingIds() {
        return missingIds;
    }

}
