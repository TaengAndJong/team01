package com.example.team01.cart.service;

import com.example.team01.dto.cart.CartDTO;
import com.example.team01.vo.BookVO;
import com.example.team01.vo.CartVO;
import org.apache.ibatis.annotations.Param;

import java.util.List;


public interface CartService {

    
    // 도서의 수량 확인
   // public CartVO checkBookCount(String bookId);

    //장바구니에 담을 도서 정보 조회
    public CartVO selectBookInfo(Long bookId);

    // 장바구니에 조회된 도서 insert
    public int insertBook(CartVO bookInfo);

    //장바구니에 담긴 클라이언트별 장바구니 목록 조회
    public List<CartDTO> selectUserBookList(String clientId);

    //장바구니에 담긴 해당 클라이언트의 특정상품 중복 조회
    public int selectDuplicateCheck(String clientId,Long bookId);

    //장바구니에서 삭제
    public int deleteToCartList(List<String> deleteIds);

    //장바구니 수량변경
    public int updateToCartQuantity(CartVO bookInfo);


}
