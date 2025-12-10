package com.example.team01.vo;


import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;


// 롬복 @Data를 사용하면 , getter, setter,ToString,equals()를 전부 생성해줌
@ToString
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ClientVO implements Serializable {

    private String clientId;//사용자아이디
    private String clientName; // 사용자이름
    private String password; // 비번
    private String birth; //출생연도
    private String tel; //전화번호
    private String zoneCode; //우편번호
    private String addr; // 기본주소
    private String detailAddr; // 상세주소
    private String email;
    private byte[] picture; // 프로필사진 BLOB는 byte[]로
    private LocalDateTime joinDate; // 회원가입일, db의 timestamp는 localDatetime으로
    private LocalDateTime withdrawaldate; // 탈퇴일
    private String status;
    private String selecedAddrId;
    private String roleId; // 평탄화


    private RoleVO roleVO; // 1:1 관계인 Role 테이블의 정보를 담는 객체 ==> 조인해서 사용할 때 resultMap에 사용되는 객체
    private DepartmemtVO departmemtVO; // 부서와 사원의 1:1 관계 client VO

}
