package com.example.team01.cart.dao;

import com.example.team01.vo.CartVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;


@Mapper
public interface CartDao {

    //도서 존재유무와 재고확인필요
    public boolean checkBookCount(@Param("bookId") String bookId, @Param("quantity") int quantity);

    //장바구니에 담을 도서 정보 조회
    public CartVO insertToCartList(CartVO cartVO);

    //장바구니에서 삭제
    public CartVO deleteToCartList(@Param("cartId") String cartId);

}
