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
    public int wishListStatus(@Param("clientId")String clientId, @Param("bookId")String bookId);

    //해당유저의 찜목록 데이터가 디비에 존재하는지 여부 판단쿼리
    public int existWishList(@Param("clientId")String clientId, @Param("bookId")String bookId);

}
