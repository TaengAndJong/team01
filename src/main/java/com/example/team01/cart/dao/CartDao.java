package com.example.team01.cart.dao;

import com.example.team01.vo.BookVO;
import com.example.team01.vo.CartVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;


@Mapper
public interface CartDao {


    //도서 존재유무와 재고확인필요
    public BookVO checkBookCount(@Param("bookId") String bookId);

    //장바구니에 도서 존재유무
    public int existCart(@Param("clientId") String clientId, @Param("bookId") String bookId);

    //장바구니에 담을 도서 정보 조회
    public CartVO selectBookInfo(@Param("bookId") String bookId);

    //장바구니에 도서정보 담기
    public int insertCart(CartVO bookInfo);
    public int updateCart(@Param("bookId") String bookId,@Param("quantity") int quantity);

    //장바구니에 담긴 도서 목록 조회
    public List<CartVO> selectUserBookList(@Param("clientId") String clientId);

    //장바구니에서 삭제
    public int deleteToCartList(@Param("deleteIds") List<String> deleteIds);

    //배송지 선택 변경 업데이트
    public int updateCartAddress(@Param("clientId") String clientId,@Param("addrId") String addrId);


}
