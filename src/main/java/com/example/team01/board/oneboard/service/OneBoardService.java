package com.example.team01.board.oneboard.service;

import com.example.team01.vo.OneBoardVO;
import java.util.List;
public interface OneBoardService {
    void CreateOneBoard(OneBoardVO vo);
    List<OneBoardVO> GetOneBoardList(String userId);
    OneBoardVO getOneBoardDetail(String boardId, String userId);
    int deleteOneBoard(String boardId);
}
