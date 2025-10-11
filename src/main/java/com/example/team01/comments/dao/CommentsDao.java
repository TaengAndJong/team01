package com.example.team01.comments.dao;

import org.apache.ibatis.annotations.Mapper;
import com.example.team01.vo.CommentsVO;
import java.util.List;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface CommentsDao {
    public int insertComment(CommentsVO commentsVO);
    public CommentsVO getCommentById(@Param("qnaRefId") String qnaRefId,@Param("commentType") String commentType);
    public int postCommentUpdate(CommentsVO commentsVO);
    public int postCommentDelete(@Param("commentId") String commentId);
}
