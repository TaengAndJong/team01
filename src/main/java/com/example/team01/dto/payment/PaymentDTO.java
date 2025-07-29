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
public class PaymentDTO {
    
    //데이터베이스로 전달해줄 vo to DTO
    //private String payId; 시퀄스로 자동생성 시 작성할 필요 없음
    private int payAccount; // null 값이 들어올일 없으니까 Integer 할 필요 없을 듯!
    private String paymentMethod;
    private String addrId;

}


