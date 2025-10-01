package com.example.team01.userViewBook.dto;


import com.example.team01.common.support.BookImgChange;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserBookResponseDTO implements BookImgChange {

    /* 응답을 내보낼 데이터 객체만 기입 */

    private String viewId;// 조회 Id
    private LocalDateTime viewDate;// 조회 날짜
    private String clientId;// 로그인 사용자명
    private String bookId;// 도서아이디
    private String bookName; // 도서명
    private String bookCateNm; // 카테고리명
    private String bookCateDepth; // 카테고리 뎁스
    private String author;//저자
    private int bookPrice;//가격
    private String publishDate; //발행일
    private String stockStatus; // 재고
    private String cateId; //카테고리 Id
    private String bookImgPath; //도서이미지 DB 저장 용
    private List<String> bookImgList; // 서버주소 + 파일명 ==> bookImgChange 사용할때 필요
    private String recomType; //도서 추천타입


}
