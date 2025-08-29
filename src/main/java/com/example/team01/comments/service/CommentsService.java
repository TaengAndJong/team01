package com.example.team01.comments.service;

import com.example.team01.vo.CommentsVO;
import java.util.List;
import org.springframework.stereotype.Service;


public interface CommentsService {
    public int insertComment(CommentsVO commentsVO);
    public CommentsVO getCommentById(String qnaRefId, String commentType);  // 단일 댓글 반환
    
}
