package com.example.team01.wishList.service;

import com.example.team01.common.Enum.WishStatus;
import com.example.team01.utils.Pagination;
import com.example.team01.vo.WishListVO;
import jakarta.servlet.http.HttpServletRequest;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

public interface WishListService {

    //찜목록 조회
    public List<WishListVO> getWishList(Pagination pagination,HttpServletRequest request);

    //찜목록 저장  (해당 유저 구분 == clientId, 저장할 도서 구분 == bookId)
    public WishStatus insertWishList(String clientId, String bookId);

    //해당유저의 찜목록 bookId만 조회
    public List<String> selectWishIds(String clientId);
}