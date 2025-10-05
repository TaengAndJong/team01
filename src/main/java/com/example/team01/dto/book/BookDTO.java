package com.example.team01.dto.book;


import com.example.team01.common.support.BookImgChange;
import lombok.*;

import java.util.List;

@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookDTO implements BookImgChange {

    private String bookId;//도서ID
    private String bookCateNm;//도서카테고리 ==> Category.cateId 와 book의 cateId에 대한 고려필요
    private String bookName;//도서제목
    private String bookCateDepth; // 도서 카테고리 뎊스 (배열로 변경)
    private String author;//저자
    private String publishDate;//발행일
    private String recomType;
    private String cateId;
    private String detailUrl;//도서 상세보기 주소
    private int bookPrice;//도서가격
    private int quantity;//도서 구매수량
    private int stock;//재고 ==> 등록된 도서가 0 일때 품절 표시, 0초과일 때 재고수량 표시

    private String bookImgPath; //도서이미지 DB 저장 용
    private List<String> bookImgList; // 서버주소 + 파일명

    private String partPayStatus; // 결제내역 상태
  

}
