package com.example.team01.signup.dto.staff;

import lombok.*;

@ToString
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class StaffConfirmRequest {
    //사원번호 검증요청 DTO
    private String staffId;
    private String isStaff;
    private String staffName;
    private String staffTelNum;
    private String staffEmail;


}
