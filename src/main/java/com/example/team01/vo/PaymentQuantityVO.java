package com.example.team01.vo;

import lombok.*;

import java.io.Serializable;


@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class PaymentQuantityVO implements Serializable {

    private String payId;
    private Integer totalBookCount; // Integer  타입은 null 이여도 nullpointException 발생 방지
}
