package com.example.team01.wishList.service;

import com.example.team01.common.Enum.WishStatus;
import com.example.team01.vo.WishListVO;
import jakarta.servlet.http.HttpServletRequest;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface WishListService {

    //찜목록 조회
    public List<WishListVO> getWishList(String clientId, HttpServletRequest request);

    //찜목록 저장  (해당 유저 구분 == clientId, 저장할 도서 구분 == bookId)
    public WishStatus insertWishList(String clientId, String bookId);


}
