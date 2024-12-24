package com.example.team01.vo;


import lombok.*;
import jakarta.persistence.Id; // 관계형 디비에서 사용
import java.io.Serializable;
import java.time.LocalDateTime;

@ToString
@Getter // 은닉화된 정보를 캡슐화
@Setter
@NoArgsConstructor//기본생성자
@AllArgsConstructor //파라미터로 받는 생성자 전부 생성, 객체 생성시 모든 필드 초기화
public class SignUpVO implements Serializable {

    @Id
    private String clientId;      // 고객 ID (PK)
    private String roleId;        // 역할 ID
    private String clientName;    // 고객 이름
    private String password;      // 비밀번호
    private String birth;         // 생년월일 (YYYYMMDD)
    private String identiNum;     // 주민등록번호
    private String tel;           // 전화번호
    private String zipCode;       // 우편번호
    private String addr;          // 주소
    private String detailAddr;    // 상세 주소
    private String email;         // 이메일 주소
    private byte[] picture;       // 프로필 사진 (BLOB)
    private LocalDateTime joinDate; // 가입 일자 (TIMESTAMP)
}