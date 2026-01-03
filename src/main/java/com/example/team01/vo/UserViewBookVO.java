package com.example.team01.vo;


import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;
import java.sql.Timestamp;
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
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class UserViewBookVO implements Serializable {

    private String viewId; // primary key
    private  String clientId; // foreign key
    private Long bookId; // foreign key

    @DateTimeFormat(pattern = "yyyy.MM.dd HH:mm:ss")
    private LocalDateTime viewDate; // 유저가 조회한 날짜
    //사용자별 도서조회 데이터 조인 시 매핑할 book 객체 ==> mapper.xml 에서 resultMap 작성
    private BookVO bookVO; // has-a 관계
}
