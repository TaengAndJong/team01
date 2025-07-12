package com.example.team01.vo;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;


@AllArgsConstructor
@NoArgsConstructor
@Data
public class PaymentListVO implements Serializable {

    public String payId; // payment와 조인할 fk
    public String bookId; // book과 조인할 fk
    public int quantity;

   // public List<BookVO> bookList; // 파라미터로 받아올 도서목록

}
