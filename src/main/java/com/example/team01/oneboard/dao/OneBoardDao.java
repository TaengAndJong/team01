package com.example.team01.oneboard.dao;

import com.example.team01.vo.OneBoardVO;
import java.util.List;

public interface OneBoardDao {
    void CreateOneBoard(OneBoardVO vo);
    List<OneBoardVO> GetOneBoardList(String userId);
    OneBoardVO getOneBoardDetail(String boardId, String userId);
    void deleteOneBoard(String boardId);
}
