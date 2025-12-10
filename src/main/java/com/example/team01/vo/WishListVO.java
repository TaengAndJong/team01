package com.example.team01.vo;

import lombok.*;
import lombok.extern.slf4j.Slf4j;

import java.io.Serializable;
import java.time.LocalDateTime;


@Slf4j
@Setter
@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class WishListVO implements Serializable { // 직렬화 자바데이터타입 => 바이트로 변경

    private Long wishId; //찜한 목록 ID ==> primary key ( || index) 는 Long, Integer, int로 보편적으로 지정하며, psql에서 자동증가 타입은 문자열 불가
    private LocalDateTime wishDate; // 찜한날짜 ==> 자동증가일 경우 insert문 쿼리에 기입 안 해도 됨
    private String clientId; // 클라이언트에서 서버로 데이터를 전송할때 파라미터를 받아오는 인스턴스
    private String bookId; // 클라이언트에서 서버로 데이터를 전송할때 파라미터를 받아오는 인스턴스
    private String wishStatus;


    //조인하여 조회하는 경우에 사용하는 clientVO 객체 (1:1) ( 서버 to 클라이언트 ) : 유저정보
    private ClientVO clientVO;
    //조인하여 조회하는 경우에 사용하는 bookVO 객체 (1:1) ( 서버 to 클라이언트 ) : 도서정보
    private BookVO bookVO;

}
