package com.example.team01.board.oneboard.dao;

import com.example.team01.vo.OneBoardVO;
import java.util.List;

public interface OneBoardDao {
    void CreateOneBoard(OneBoardVO vo);
    List<OneBoardVO> GetOneBoardList(String userId);
    OneBoardVO getOneBoardDetail(String boardId, String userId);
    int deleteOneBoard(String boardId);
}
