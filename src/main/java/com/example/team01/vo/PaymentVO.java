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

    // resultMap과 매핑할 객체, 데이터베이스의 데이터를 클라이언트로 보내줄 때 사용.
    private AddressVO addressVO; // 1:1
    //도서상품 조회
    private List<CartVO> cartList;// 1:N ( 지불할 도서의 수량이 여러개 일 수 있음);


}
