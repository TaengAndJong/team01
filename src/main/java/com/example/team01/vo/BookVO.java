package com.example.team01.vo;

public class BookVO {


    private String bookId; //도서등록고유번호
    private String bookName;//도서명
    private String bookDesc;//도서설명
    private String author;//저자
    private int bookPrice;//도서가격
    private byte[] bookImg;//도서이미지 파일은 byte[]로 저장
    private int stock;// 재고수량
    private String stockStatus;//품절상태
   // private String isbn;// 보류
    private String publishDate; // 출판일
    private String userId; // 회원아이디
    private String roleId; // 회원의 역할 : 사원 / 관리자/ 일반회원 ==> 도서 등록자명
    private String cateId; // 도서 카테고리 고유번호
    private String cateName; // 도서 카테고리 고유번호
    private String cateDepth; // 도서 카테고리 고유번호
    private String wishID;  // 찜 목록 아이디
    private String viewCnt; // 특정 도서에 대한 조회수

    // 특정 도서에 대한 찜목록수 ==> 구매하고 싶은 순위 도출?
    // ==> 특정도서를 조회 후 특정 도서를 찜한 유저 수 조회 
    // 특정 도서에 대한 조회 수==> 관심 높은 도서 순위 도출?
    // 특정 도서를 조회 후 , vieWCnt를 내림차순으로 정렬

}
