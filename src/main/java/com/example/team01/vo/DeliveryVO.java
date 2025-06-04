package com.example.team01.vo;


import lombok.*;

import java.io.Serializable;


@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryVO implements Serializable {

    private String delId;
    private String delAdress;
    private String delAdress1;
    private String delAdress2;
    private String delStatus;
    private String delStartDate;
    private String delComDate;
    private String delPrice;
    private String clientId;
    private String roleId;

}
