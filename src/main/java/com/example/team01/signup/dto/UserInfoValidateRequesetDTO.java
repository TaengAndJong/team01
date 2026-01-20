package com.example.team01.signup.dto;

import lombok.*;

@ToString
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UserInfoValidateRequesetDTO {

    //request일 경우에는 @Builder 생략, response 일 경우 사용
    private String clientId;
    private String staffId;
    private String tel;
    private String email;
    private String clientName;

}
