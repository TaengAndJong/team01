package com.example.team01.cart.service;

import com.example.team01.vo.BookVO;
import com.example.team01.vo.CartVO;


public interface CartService {

    public boolean checkBookCount(String bookId, int quantity);

    //장바구니에 담을 도서 정보 조회
    public CartVO selectBookInfo(String bookId);

    // 장바구니에 조회된 도서 insert
    public int insertBook(BookVO book);

    //장바구니에서 삭제
    public CartVO deleteToCartList(String cartId);

}
