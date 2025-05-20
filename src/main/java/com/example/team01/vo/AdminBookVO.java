package com.example.team01.vo;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;


@ToString
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AdminBookVO {



    private String bookId; //도서등록고유번호 ==> 데이터베이스에서 자동증가
    private String bookCateNm; //  private String bookCateNm; // 도서 카테고리 (배열로 변경)
    private String bookCateDepth; // 도서 카테고리 뎊스 (배열로 변경)
    private String bookName;//도서명
    private String bookDesc;//도서설명
    private String author;//저자
    private int bookPrice;//도서가격
    private int stock;// 재고수량
    private String stockStatus;//품절상태
   // private String isbn;// 보류
    private String publishDate; // 출판일
    private String roleId; // 회원의 역할 : 사원 / 관리자/ 일반회원 ==> 도서 등록자명
    private String cateId; // 도서 카테고리 고유번호 (배열로 변경)
    private List<MultipartFile> bookImg;  // 다중 파일 업로드
    private List<String> bookImgList;
    private String bookImgPath;  // DB 저장 용
    private String writer; // 회원아이디
    private LocalDateTime createDate; // 도서등록일


    //정규화로 테이블 따로 만들건지 고려 필요
    private String viewCnt; // 특정 도서에 대한 조회수
    private String wishID;  // 찜 목록 아이디



}
