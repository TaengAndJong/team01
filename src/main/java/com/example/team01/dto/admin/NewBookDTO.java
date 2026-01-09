package com.example.team01.dto.admin;

import java.sql.Timestamp;

import lombok.*;

@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class NewBookDTO {
    private Long bookId; // 책 ID
    private String bookCateNm; // 카테고리
    private String bookName; // 책 이름
    private String author; // 저자
    private String stockStatus; // 재고 상태
    private Timestamp createDate; // 발행일
}
