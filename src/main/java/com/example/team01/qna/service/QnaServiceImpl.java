package com.example.team01.qna.service;

import com.example.team01.qna.dao.QnaDao;
import com.example.team01.vo.QnaVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service // 스프링의 서비스 계층 컴포넌트로 등록
public class QnaServiceImpl implements QnaService {

    private final QnaDao qnaDao;

    // 생성자 주입 (권장)
    @Autowired
    public QnaServiceImpl(QnaDao qnaDao) {
        this.qnaDao = qnaDao;
    }

    @Override
    public QnaVO getUserQnaData(String qnaId) {
        // DAO 계층 메서드 호출 및 리턴
        return qnaDao.userQnaDataList(qnaId);
    }
}