package com.example.team01.dto.admin;

import lombok.*;

@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockBookDTO {
    private Long bookId; // 책 ID
    private String bookCateNm; // 카테고리
    private String bookName; // 책 이름
    private String author; // 저자
    private int stock; // 재고량
    private String stockStatus; // 재고 유무
    private String publishDate; // 발행일
}
