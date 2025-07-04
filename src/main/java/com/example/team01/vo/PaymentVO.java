package com.example.team01.vo;


import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;


@ToString
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class PaymentVO implements Serializable {

    private String payId;
    private int payAccount; // null 값이 들어올일 없으니까 Integer 할 필요 없을 듯!
    private String payStatus;
    private String paymentMethod;
    private LocalDateTime payDate;


    // 클라이언트에서 파라미터 받아올 용도
    private List<String> cartIds;
    private String addrId;

    // resultMap과 매핑할 객체
    private AddressVO addressVO; // 1:1



}
