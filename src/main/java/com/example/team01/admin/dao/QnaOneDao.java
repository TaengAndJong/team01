package com.example.team01.admin.dao;

import com.example.team01.utils.Pagination;
import com.example.team01.vo.AdminBookVO;
import com.example.team01.vo.QnaOneVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface QnaOneDao {


    public List<QnaOneVO> getAllQnaOneList(@Param("pagination") Pagination pagination, @Param("userId") String userId);

    int totalRecord(@Param("pagination") Pagination pagination ,@Param("userId") String userId);

    public QnaOneVO getQnaOneDetailBoard(@Param("boardId") String boardId, @Param("userId") String userId);

    public int deleteOneBoard(@Param("boardId") String boardId);

    public int updateQnaOneStatus(@Param("boardId") String boardId);
}
