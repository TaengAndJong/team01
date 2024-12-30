package com.example.team01.qna.dao;

import com.example.team01.vo.QnaVO;


public interface QnaDao {

    public QnaVO userQnaDataList (String userId); // 사용자 id에 해당하는 게시글을 보내 줌

}
