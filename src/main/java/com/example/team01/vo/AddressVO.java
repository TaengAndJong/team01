package com.example.team01.vo;

import lombok.*;
import java.io.Serializable;


@ToString
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AddressVO implements Serializable {

    private String addrId; //
    private String clientId;
    private String addrType;
    private String addr;
    private String zoneCode;
    private String detailAddr;

}
