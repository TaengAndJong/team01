package com.example.team01.board.deliveryboard.service;

import com.example.team01.vo.DeliveryBoardVO;
import java.util.List;

public interface DeliveryBoardService {
    int CreateDeliveryBoard(DeliveryBoardVO vo);
    List<DeliveryBoardVO> GetDelivBoardlist(String userId);
    DeliveryBoardVO getDeliveryBoardDetail(String boardId, String userId);
    int deleteDeliveryBoard(String boardId);
}
