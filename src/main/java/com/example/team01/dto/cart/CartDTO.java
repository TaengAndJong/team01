package com.example.team01.dto.cart;

import com.example.team01.dto.book.BookDTO;
import com.example.team01.vo.BookVO;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartDTO { // 하나의 레코드를 의미
    //클라이언트로 보내줄 엔터티만 작성
    private String cartId; //장바구니 생성아이디
    private LocalDateTime addCartDate; // 장바구니에 담은 날짜
    private int quantity; // 구매수량
    //private String bookId; // 구입할 도서 아이디
    private String clientId; // 로그인한 유저 아이디
    private String roleId; // 로그인한 유저의 역할
    private BookDTO book; // 1:1 단일 매핑인 vo를 DTO 타입으로 변환
}
