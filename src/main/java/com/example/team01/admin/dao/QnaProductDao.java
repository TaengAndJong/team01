package com.example.team01.admin.dao;

import com.example.team01.utils.Pagination;
import com.example.team01.vo.AdminBookVO;
import com.example.team01.vo.QnaProductVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface QnaProductDao {

    // 상품 문의 목록 조회
    public List<QnaProductVO> getAllQnaProductList(@Param("pagination") Pagination pagination,@Param("userId")String userId);

    // 상품 문의 총 개수
    int totalRecord(@Param("pagination") Pagination pagination,@Param("userId") String userId);

    // 상품 문의 상세 조회
    public QnaProductVO getProDetailBoard(@Param("boardId") String boardId, @Param("userId") String userId);

    // 상품 문의 게시물 삭제
    public int deleteProductBoard(@Param("boardId") String boardId);

    // 상품 문의 게시물 답변여부 수정
    public int updateQnaProductStatus(@Param("boardId") String boardId);
}
