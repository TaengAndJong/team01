package com.example.team01.wishList.service;

import com.example.team01.vo.WishListVO;

import java.util.List;

public interface WishListService {

    //찜목록 조회
    public List<WishListVO> getWishList(String clientId);

    //찜목록 저장  (해당 유저 구분 == clientId, 저장할 도서 구분 == bookId)
    public int insertWishList(String clientId, String bookId);

    //찜목록 삭제 (해당 유저 구분 == clientId, 삭제할 도서 구분 == bookId)
    public int deleteWishList(String clientId, String bookId);

}
