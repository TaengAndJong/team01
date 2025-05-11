package com.example.team01.qna.service;
import com.example.team01.vo.QnaOneVO;
import java.util.List;

public interface QnaOneService {

    public List<QnaOneVO> getUserQnaOneData(String clientId);
}
