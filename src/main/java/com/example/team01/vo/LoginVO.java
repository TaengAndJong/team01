package com.example.team01.vo;

import lombok.*;

import java.io.Serializable;


@ToString
@Getter // 은닉화된 정보를 캡슐화
@Setter
@NoArgsConstructor//기본생성자
@AllArgsConstructor //파라미터로 받는 생성자 전부 생성, 객체 생성시 모든 필드 초기화
public class LoginVO implements Serializable {

    private String clientId;  // 사용자 아이디 (예: 이메일 또는 사용자 이름)
    private String password;  // 비밀번호
    private String identifyNumber;//주민등록번호
    private String email;     // 이메일 (선택사항)
    //private boolean rememberMe; // 로그인 유지 여부 (선택사항)
    
    //로그인 시 유저의 역할에 따라 권한 설정에 필요
    private String roleId;     // 사용자 역할 (예: ROLE_ADMIN, ROLE_CLIENT,ROEL_MEMBER 등)
}

//로그인 시 필요한 검증 데이터 "아이디","비밀번호" , "주민등록번호"
//로그인 시, 어떤 역할을 가지고 있는지 확인 필요 "역할 ID 검증"