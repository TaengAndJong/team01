package com.example.team01.dto.payment;

import com.example.team01.dto.address.AddressDTO;
import com.example.team01.dto.cart.CartDTO;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

/*
*
*
* */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder //new연산자 + 생성자()메서드를 생성하지 않고 값 설정 가능하게함
public class PaymentResponseDTO {
    
    //클라이언트에게 반환할 엔터티만 기입

    private String payId;
    private int payAccount; // null 값이 들어올일 없으니까 Integer 할 필요 없을 듯!
    private String payStatus;
    private String paymentMethod;
    private LocalDateTime payDate;

    // CartDTO 엔터티만 list로 반환
    private List<CartDTO> cartList;
    //
    private AddressDTO address;
}


