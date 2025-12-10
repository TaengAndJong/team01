package com.example.team01.mypage.userInfo.dto;


import lombok.*;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;


@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserInfoDTO {

    private String clientId;//사용자아이디
    private String clientName; // 사용자이름
   // private String password; // 비번
    private String birth; //출생연도
    private String tel; //전화번호
    private String zoneCode; //우편번호
    private String addr; // 기본주소
    private String detailAddr; // 상세주소
    private String email; // 이메일
   // private byte[] picture; // 프로필사진 BLOB는 byte[]로
    private LocalDateTime joinDate; // 회원가입일, db의 timestamp는 localDatetime으로
    private LocalDateTime withdrawDate; // 탈퇴일
    private String status;
    private String selecedAddrId; // 주소변경시 선택된 주소 아이디

    private String roleId; // 역할 아이디


}
