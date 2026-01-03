package com.example.team01.vo;



import lombok.*;


import java.io.Serializable;



@ToString
@Getter // 은닉화된 정보를 캡슐화
@Setter
@NoArgsConstructor//기본생성자
@AllArgsConstructor //파라미터로 받는 생성자 전부 생성, 객체 생성시 모든 필드 초기화
public class PageVO implements Serializable {

    //접근제한자 private는 정보은닉화 함
    private String pageId; 
    private String pagePath;
    private String pageName;

}


//readMe java 참고
//https://docs.google.com/document/d/1wUyyCyRPi0HRtqPgWqPXERFT7gpfT4I4Tbwv6RELmeY/edit?tab=t.0


//@Entity //vo 객체가 데이터베이스와 매핑됨을 의미
//@Table(name="page")