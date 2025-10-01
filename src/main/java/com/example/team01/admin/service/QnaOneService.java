package com.example.team01.admin.service;
import com.example.team01.vo.QnaOneVO;
import com.example.team01.utils.Pagination;

import java.util.List;


public interface QnaOneService {
    //                                        클래스   참조변수
    public List<QnaOneVO> getAllQnaOneList(Pagination pagenation);

    // 1:1 문의 상세 조회
    public QnaOneVO getQnaOneDetail(String boardId, String userId);
    
    // 1:1 문의 게시물 삭제
    public int deleteOneBoard(List<String> boardId);

    // 1:1 문의 게시물 답변여부 수정
    public int updateQnaOneStatus(String boardId);
}
