package com.example.team01.comments.service;

import org.springframework.stereotype.Service;
import com.example.team01.comments.dao.CommentsDao;
import com.example.team01.vo.CommentsVO;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


@Slf4j
@RequiredArgsConstructor
@Service
public class CommentsServiceImple implements CommentsService {
    private final CommentsDao commentsDao;



    @Override
    public int insertComment(CommentsVO commentsVO) {
        // 실제 DB 저장 대신 로그만 출력
        System.out.println("통신 확인용 - 받은 데이터: " + commentsVO);
        // 댓글 등록 메서드 호출
        return commentsDao.insertComment(commentsVO);
    }

    @Override
    public CommentsVO getCommentById(String qnaRefId, String commentType) {
        log.info("답변 메서드 호출", qnaRefId, commentType);
        return commentsDao.getCommentById(qnaRefId, commentType);
    }
}
