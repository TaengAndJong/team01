package com.example.team01.cart.service;

import com.example.team01.vo.CartVO;
import org.apache.ibatis.annotations.Param;

public interface CartService {

    public boolean checkBookCount(String bookId, int quantity);

    //장바구니에 담을 도서 정보 조회
    public CartVO insertToCartList(CartVO cartVO);

    //장바구니에서 삭제
    public CartVO deleteToCartList(String cartId);

}
