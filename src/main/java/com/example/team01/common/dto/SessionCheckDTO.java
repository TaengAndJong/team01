package com.example.team01.common.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SessionCheckDTO {

    private boolean authenticated;
    private String clientId;
    private String clientName;
    private String roleId;

}
