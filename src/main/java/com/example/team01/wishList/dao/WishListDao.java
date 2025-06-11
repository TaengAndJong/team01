package com.example.team01.wishList.dao;

import com.example.team01.vo.WishListVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface WishListDao {

    //찜목록 조회
    public List<WishListVO> getWishList(@Param("clientId") String clientId);

    //찜목록 저장  (해당 유저 구분 == clientId, 저장할 도서 구분 == bookId)
    public int insertWishList(@Param("clientId")String clientId, @Param("bookId")String bookId);

    //찜목록 삭제 (해당 유저 구분 == clientId, 삭제할 도서 구분 == bookId)
    public int deleteWishList(@Param("clientId")String clientId, @Param("bookId")String bookId);


}
