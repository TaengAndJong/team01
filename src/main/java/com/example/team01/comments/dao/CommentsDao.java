package com.example.team01.comments.dao;

import org.apache.ibatis.annotations.Mapper;
import com.example.team01.vo.CommentsVO;
import java.util.List;

@Mapper
public interface CommentsDao {
    public int insertComment(CommentsVO commentsVO);
}
