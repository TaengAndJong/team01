package com.example.team01.dto.payment;


import lombok.*;

import java.util.List;


@ToString
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentCancelDTO {

    private String payId;
    private String bookId;
    private String partPayStatus;

    private List<String> bookIds;
    private List<String> payIds; //전체 결제 취소

    public PaymentCancelDTO(String payId, List<String> bookIds) {
        this.payId = payId;
        this.bookIds = bookIds;
    }


    /*
    * AllArgsConstructor을 사용하면 필드개수에 맞게 자동으로 필드개수를 파라미터로 받는 생성자가 자동생성되어 에러가 발생할 수 있음!
    * not sutable constructor found 에러가 발생하면 명시적으로 사용할 생성자를 작성해 주면 됨
    * */
    
}
