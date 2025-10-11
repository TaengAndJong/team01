package com.example.team01.board.oneboard.dao;

import com.example.team01.vo.OneBoardVO;
import com.example.team01.vo.ProductBoardVO;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface OneBoardDao {
    int CreateOneBoard(OneBoardVO vo);
    List<OneBoardVO> GetOneBoardList(@Param("userId") String userId);
    OneBoardVO getOneBoardDetail(@Param("boardId") String boardId,@Param("userId") String userId);
    int deleteOneBoard(@Param("boardId") String boardId);
}
