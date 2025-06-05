package com.example.team01.delivery.service;


import com.example.team01.vo.DeliveryVO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DeliveryServiceImpl implements DeliveryService{


    @Override
    public List<DeliveryVO> selectAddress(String clientId) {
        return List.of();
    }

    @Override
    public List<DeliveryVO> insertAddress(DeliveryVO deliveryVO) {
        return List.of();
    }

    @Override
    public List<DeliveryVO> updateAddress(DeliveryVO deliveryVO) {
        return List.of();
    }

    @Override
    public List<DeliveryVO> deleteAddress(String deliveryId) {
        return List.of();
    }
}
