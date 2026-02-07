package com.example.team01.signup.dto.staff;


import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class StaffConfirmResponse {
    private String staffId;
    private String staffName;
    private String staffPosition;
    private String staffTelNum;
    private String staffEmail;
    private String staffAddr;
    private String staffAct;
}
