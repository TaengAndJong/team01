package com.example.team01.admin.dao;

import com.example.team01.utils.Pagination;
import com.example.team01.vo.AdminBookVO;
import com.example.team01.vo.QnaDeliveryVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface QnaDeliveryDao {


    public List<QnaDeliveryVO> getAllQnaDeliveryList(@Param("pagination") Pagination pagination);

    int totalRecord(@Param("pagination") Pagination pagination);

    public QnaDeliveryVO getDeliveryDetailBoard(@Param("boardId") String boardId, @Param("userId") String userId);

    public int deleteDeliveryBoard(@Param("boardId") String boardId);

    public int updateQnaDeliveryStatus(@Param("boardId") String boardId);
}