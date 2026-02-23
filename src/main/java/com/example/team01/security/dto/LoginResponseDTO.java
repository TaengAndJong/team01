package com.example.team01.security.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public  class LoginResponseDTO {

    private boolean authenticated;
    private String clientId;
    private String clientName;
    private String message;
    private String redirect;
    private String roleId;
    private String status;
    private String userStatus;
}
