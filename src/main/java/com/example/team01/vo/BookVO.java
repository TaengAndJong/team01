package com.example.team01.vo;


import com.example.team01.common.support.BookImgChange;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Setter
@Getter
@ToString
@NoArgsConstructor
public class BookVO implements BookImgChange {

    private String bookId;//도서ID
    private String bookCateNm;//도서카테고리 ==> Category.cateId 와 book의 cateId에 대한 고려필요
    private String bookName;//도서제목
    private String bookCateDepth; // 도서 카테고리 뎊스 (배열로 변경)
    private String author;//저자
    private String publishDate;//발행일
    private String bookDesc;// 도서설명
    private String recomType;//도서등록분류
    private String cateId;//카테고리 아이디
    private int bookPrice;//도서가격
    private int stock;//재고 ==> 등록된 도서가 0 일때 품절 표시, 0초과일 때 재고수량 표시
    private String stockStatus;//재고상태
    private String saleStatus;// 판매 상태관리


    private String bookImgPath; //도서이미지 DB 저장 용
    private List<String> bookImgList; // 서버주소 + 파일명

    private String detailUrl;//메인슬라이드 주소매핑용

    //도서재고수량 확인
    private Integer checkStock;


    //정규화로 view 테이블 따로 만들건지 고려 필요
    private String viewCnt; // 특정 도서에 대한 조회수 ==> 좋아요 ?
    private String wishID;  // 찜 목록 아이디
}


