package com.example.team01.deliveryboard.service;

import com.example.team01.vo.DeliveryBoardVO;
import java.util.List;

public interface DeliveryBoardService {
    void CreateDeliveryBoard(DeliveryBoardVO vo);
    List<DeliveryBoardVO> GetDelivBoardlist(String userId);
}
