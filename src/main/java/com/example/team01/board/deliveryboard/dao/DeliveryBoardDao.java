package com.example.team01.board.deliveryboard.dao;

import com.example.team01.vo.DeliveryBoardVO;
import java.util.List;
import org.apache.ibatis.annotations.Param;

public interface DeliveryBoardDao {
    int CreateDeliveryBoard(DeliveryBoardVO vo);
    List<DeliveryBoardVO> GetDelivBoardlist(@Param("userId") String userId);
    DeliveryBoardVO getDeliveryBoardDetail(@Param("boardId") String boardId, @Param("userId") String userId);
    int deleteDeliveryBoard(@Param("boardId") String boardId);
}
