package com.example.team01.qna.service;
import com.example.team01.vo.QnaVO;
import java.util.List;

public interface QnaService {

    public List<QnaVO> getUserQnaData(String userId);
}
