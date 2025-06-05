package com.example.team01.delivery.service;

import com.example.team01.vo.DeliveryVO;

import java.util.List;

public interface DeliveryService {

    // 유저에 따른 배송지 조회 ( 3개까지 주소 등록??)
    public List<DeliveryVO> selectAddress(String clientId);

    // 유저에 따른 배송지 등록
    public List<DeliveryVO> insertAddress(DeliveryVO deliveryVO);

    //유저에 따른 배송지 업데이트 ( deliveryId,
    public List<DeliveryVO> updateAddress(DeliveryVO deliveryVO);

    //유저에 따른 배송지 삭제
    public List<DeliveryVO> deleteAddress(String deliveryId);

}
