package com.example.team01.qna.dao;

import com.example.team01.vo.QnaOneVO;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface QnaOneDao {

    public List<QnaOneVO> allQnaDataList (); // 사용자 id에 해당하는 게시글 전체를 보내 줌

}
