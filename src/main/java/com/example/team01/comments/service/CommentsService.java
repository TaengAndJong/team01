package com.example.team01.comments.service;

import com.example.team01.vo.CommentsVO;
import java.util.List;
import org.springframework.stereotype.Service;


public interface CommentsService {
    public int insertComment(CommentsVO commentsVO); // 댓글 등록
    public CommentsVO getCommentById(String qnaRefId, String commentType);  // 단일 댓글 반환
    public int postCommentUpdate(CommentsVO commentsVO); // 댓글 수정   
    public int postCommentDelete(String commentId); // 댓글 삭제
}
