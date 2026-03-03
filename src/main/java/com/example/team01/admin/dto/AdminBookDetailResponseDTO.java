package com.example.team01.admin.dto;

import com.example.team01.vo.BookImageVO;
import lombok.*;

import java.util.List;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminBookDetailResponseDTO {


    private Long bookId;//도서ID
    private String bookCateNm;//도서카테고리 ==> Category.cateId 와 book의 cateId에 대한 고려필요
    private String bookName;//도서제목
    private String bookCateDepth; // 도서 카테고리 뎊스 (배열로 변경)
    private String author;//저자
    private  String bookDesc;// 도서 설명
    private String publishDate;//발행일
    private String recomType; //
    private String cateId;
    private int bookPrice;//도서가격
    private int stock;//재고 ==> 등록된 도서가 0 일때 품절 표시, 0초과일 때 재고수량 표시
    private String stockStatus;
    private String saleStatus;// 판매 상태관리

    private List<BookImageVO> images; ; //도서상세 이미지들










}
