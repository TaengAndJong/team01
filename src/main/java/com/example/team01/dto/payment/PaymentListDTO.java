package com.example.team01.dto.payment;


import com.example.team01.dto.address.AddressDTO;
import com.example.team01.dto.book.BookDTO;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@ToString
@Builder// new연산자 + 생성자() 메서드를 생성하지 않고 값 설정 가능
public class PaymentListDTO {

    private String payId;
    private String payMethod;
    private String payStatus;
    private String payDate;
    private String payUpdateDate;
    private String clientId;

    private List<BookDTO> books;
    private AddressDTO address;

}
