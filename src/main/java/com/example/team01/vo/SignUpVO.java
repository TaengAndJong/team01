package com.example.team01.vo;


import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;

@ToString
@Getter // 은닉화된 정보를 캡슐화
@Setter
@NoArgsConstructor//기본생성자
@AllArgsConstructor //파라미터로 받는 생성자 전부 생성, 객체 생성시 모든 필드 초기화
public class SignUpVO implements Serializable {


    private String clientId;      // 고객 ID (PK)
    private String roleId;        // 역할 ID  --> roleId 선택 필요 "사원" , "일반회원" 구분 필요( 검증방법 택 1:  라디오 버튼 선택, 드롭박스 선택, 사원번호 검증)
    private String clientName;    // 고객 이름
    private String password;      // 비밀번호
    private String birth;         // 생년월일 (YYYY-MM-DD)
    private String tel;           // 전화번호
    private String zoneCode;       // 우편번호
    private String addr;          // 주소
    private String detailAddr;    // 상세 주소
    private String email;         // 이메일 주소
    private byte[] picture;       // 프로필 사진 (BLOB)
    private LocalDateTime joinDate; // 가입 일자 (TIMESTAMP)
    private LocalDateTime withDrawalDate; // 탈퇴 일자 (TIMESTAMP)
    private String status; // 가입시 기본값 '회원' --> 탈퇴시 '탈퇴'로 변경

    private String staffId;// 사원 번호
    private String staffName;// 사원명
    private String departId;// 부서번호
    private String departName;// 사원명
    private String rankId;// 직급
    // TIMESTAMP 값이 LocalDateTime으로 매핑됨
    private LocalDateTime startDate;//입사일

    public void setJoinDate(LocalDateTime joinDate) {
        this.joinDate = joinDate;
    }

}