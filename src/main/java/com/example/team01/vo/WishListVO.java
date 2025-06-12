package com.example.team01.vo;

import java.time.LocalDateTime;

public class WishListVO {

    private String wishId; //찜한 목록 ID
    private LocalDateTime wishDate; // 찜한날짜 ==> 자동증가일 경우 insert문 쿼리에 기입 안 해도 됨
    private String clientId; // 클라이언트에서 서버로 데이터를 전송할때 파라미터를 받아오는 인스턴스
    private String roleId; // 클라이언트에서 서버로 데이터를 전송할때 파라미터를 받아오는 인스턴스


    //조인하여 조회하는 경우에 사용하는 clientVO 객체 (1:1) ( 서버 to 클라이언트 )
    private ClientVO clientVO;
    //조인하여 조회하는 경우에 사용하는 roleVO 객체 (1:1) ( 서버 to 클라이언트 )
    private RoleVO roleVO;

}
