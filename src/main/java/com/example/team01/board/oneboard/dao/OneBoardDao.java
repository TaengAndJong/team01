package com.example.team01.board.oneboard.dao;

import com.example.team01.vo.OneBoardVO;
import com.example.team01.vo.ProductBoardVO;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface OneBoardDao {
    ProductBoardVO CreateOneBoard(OneBoardVO vo);
    List<OneBoardVO> GetOneBoardList(@Param("userId") String userId);
    OneBoardVO getOneBoardDetail(String boardId, String userId);
    int deleteOneBoard(String boardId);
}
