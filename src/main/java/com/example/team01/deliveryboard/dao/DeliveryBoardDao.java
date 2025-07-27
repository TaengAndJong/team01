package com.example.team01.deliveryboard.dao;

import com.example.team01.vo.DeliveryBoardVO;
import java.util.List;

public interface DeliveryBoardDao {
    void CreateDeliveryBoard(DeliveryBoardVO vo);
    List<DeliveryBoardVO> GetDelivBoardlist(String userId);
}
