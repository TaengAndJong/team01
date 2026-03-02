package com.example.team01.payment.dto;


import com.example.team01.address.dto.AddressDTO;
import com.example.team01.book.dto.BookListResponseDTO;
import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@ToString
@Builder// new연산자 + 생성자() 메서드를 생성하지 않고 값 설정 가능
public class PaymentListDTO {

    private Long payId;
    private String payMethod;
    private String payStatus;
    private String payDate;
    private String payUpdateDate;
    private String clientId;
    private int quantity;

    private List<BookListResponseDTO> books;
    private AddressDTO address;

}
