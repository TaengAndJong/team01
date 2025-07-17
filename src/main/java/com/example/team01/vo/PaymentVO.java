package com.example.team01.vo;


import com.example.team01.common.Enum.PayStatus;
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
    private String payStatus; //Enum 타입으로 선언해야 Enum 값으로 제한가능
    private String payMethod;
    private LocalDateTime payDate;
    private String addrId;
    private List<String> cartIds;// 클라이언트에서 받아올 cartId들 목록 필드
    private String clientId;

    // resultMap과 매핑할 객체, 데이터베이스의 데이터를 클라이언트로 보내줄 때 사용.
    private AddressVO addressVO; // 1:1
    //도서상품 조회
    private List<CartVO> bookList;// 1:N ( 장바구니에 담긴 도서 정고 가져와야함, 수량때문에);

}
