package com.example.team01.qna.service;

import com.example.team01.vo.QnaVO;

public interface QnaService {

    /**
     * 특정 사용자 ID에 해당하는 QnA 데이터를 조회합니다.
     *
     * @param qnaId 조회할 QnA ID
     * @return QnA 데이터 (QnaVO 객체)
     */
    QnaVO getUserQnaData(String qnaId);
}
