package com.example.team01.admin.service;

import com.example.team01.admin.dao.QnaOneDao;
import com.example.team01.vo.QnaOneVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service // 스프링의 서비스 계층 컴포넌트로 등록
public class QnaOneServiceImpl implements QnaOneService {

    private final QnaOneDao qnaOneDao;

    // 생성자 주입 (권장)
    @Autowired
    public QnaOneServiceImpl(QnaOneDao qnaOneDao) {
        this.qnaOneDao = qnaOneDao;
    }

    @Override
    public List<QnaOneVO> getAllQnaOneData() {
        // DAO 계층 메서드 호출 및 리턴
        return qnaOneDao.allQnaDataList();
    }
}

