package com.example.team01.vo;


import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

@Setter
@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor//기본생성자
public class CartVO implements Serializable {

    private Long cartId; //장바구니 생성아이디
    private LocalDateTime addCartDate; // 장바구니에 담은 날짜
    private int quantity; // 구매수량
    private Long bookId; // 구입할 도서 아이디
    private String clientId; // 로그인한 유저 아이디
    private String roleId; // 로그인한 유저의 역할

    //BookVO 클래스 ==> bookId로 조인하여 도서정보를 가져오기 위함
    private BookVO bookVO;//1:다 // Has a 관계( 1:1 )  : cart(부모) 와 book(자식) 테이블 관계
    //payment에서 결제할 도서목록들
    private List<BookVO> bookList;//1:다
}
