package com.example.team01.common.dto;


import lombok.*;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponseDTO {

    //시큐리티 인증정보 원본구조 숨김 및 클라이언트에게 공통된 구조로 전달하기 위한 DTO

    private boolean authenticated;
    private String clientId;
    private String clientName;
    private String roleId;


//    private String message;
//    private String redirect;
//    private String status;
//    private String userStatus;


}
