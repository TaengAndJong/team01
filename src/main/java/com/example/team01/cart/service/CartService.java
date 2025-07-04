package com.example.team01.cart.service;

import com.example.team01.vo.BookVO;
import com.example.team01.vo.CartVO;
import org.apache.ibatis.annotations.Param;

import java.util.List;


public interface CartService {

    
    // 도서의 수량 확인
    public CartVO checkBookCount(String bookId);

    //장바구니에 담을 도서 정보 조회
    public CartVO selectBookInfo(String bookId);

    // 장바구니에 조회된 도서 insert
    public int insertBook(CartVO bookInfo);

    //장바구니에 담긴 클라이언트별 장바구니 목록 조회
    public List<CartVO> selectUserBookList(String clientId);

    //장바구니에서 삭제
    public int deleteToCartList(List<String> deleteIds);



}
