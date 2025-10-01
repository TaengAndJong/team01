package com.example.team01.wishList.dao;

import com.example.team01.utils.Pagination;
import com.example.team01.vo.WishListVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface WishListDao {

    //찜목록 조회
    public List<WishListVO> getWishList(@Param("pagination") Pagination pagination);

    //찜목록 저장  (해당 유저 구분 == clientId, 저장할 도서 구분 == bookId)
    public int insertWishList(@Param("clientId")String clientId, @Param("bookId")String bookId);

    //찜목록 삭제 (해당 유저 구분 == clientId, 삭제할 도서 구분 == bookId)
    public int wishListStatus(@Param("clientId")String clientId, @Param("bookId")String bookId);

    //해당유저의 찜목록 데이터가 디비에 존재하는지 여부 판단쿼리
    public int existWishList(@Param("clientId")String clientId, @Param("bookId")String bookId);

    //totalRecode
    public int totalRecord(@Param("pagination") Pagination pagination);
//    public int totalRecord(@Param("clientId") String clientId,@Param("pagination") Pagination pagination);

    
    //찜목록 도서아이디만 조회 
    // ==> VO 대신 String 타입 사용 이유 = clientId 하나, 단일컬럼만 조회하기때문에 굳이 VO를 사용할 필요 없음
    // vo 사용시 vo에 담긴 모든 엔터티가 매핑됨
    public List<String> selectWishIds(@Param("clientId") String clientId);

    //3개월 이내 찜목록 건수 조회
    public int selectWishCnt(@Param("clientId") String clientId);

}
