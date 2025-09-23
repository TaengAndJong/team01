package com.example.team01.vo;


import lombok.Data;

import java.time.LocalDateTime;

/*
*@Data 롬복어노테이션,
* @Getter : 모든 필드의 getter 생성
* @Setter : 모든 필드의 setter 생성
* @ToString : 객체를 문자열로 표현하는 toString() 생성
* @EqualsAndHashCode : equals(), hashCode() 생성
* @RequiredArgsConstructor : fianl 또는 @NotNull 필드에 대해 생성자 생성
*
* private 정보은닉화 = 캡슐화
* */

//사용자가 조회한 도서 테이블 entity
@Data
public class UserViewBookVO {

    private String viewId; // primary key
    private  String clientId; // foreign key
    private String bookId; // foreign key
    private  LocalDateTime viewDate; // 유저가 조회한 날짜

}
