package com.example.team01.board.oneboard.dao;

import com.example.team01.vo.OneBoardVO;
import java.util.List;

import org.apache.ibatis.annotations.Param;

public interface OneBoardDao {
    int CreateOneBoard(OneBoardVO vo);
    List<OneBoardVO> GetOneBoardList(@Param("userId") String userId);
    OneBoardVO getOneBoardDetail(@Param("boardId") String boardId,@Param("userId") String userId);
    int deleteOneBoard(@Param("boardId") String boardId);
}
