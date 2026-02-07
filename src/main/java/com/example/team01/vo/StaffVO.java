package com.example.team01.vo;

import lombok.*;

import java.io.Serializable;


@ToString
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class StaffVO implements Serializable {

    String staffId;
    String staffName;
    String staffPosition;
    String staffTelNum;
    String staffEmail;
    String staffAddr;
    String staffAct;

}
