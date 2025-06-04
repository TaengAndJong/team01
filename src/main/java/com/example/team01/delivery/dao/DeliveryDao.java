package com.example.team01.delivery.dao;

import com.example.team01.vo.DeliveryVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface DeliveryDao {

    public List<DeliveryVO> selectAddress(@Param("clientId") String clientId);

    // 유저에 따른 배송지 등록
    public List<DeliveryVO> insertAddress(DeliveryVO deliveryVO);

    //유저에 따른 배송지 업데이트 ( deliveryId,
    public List<DeliveryVO> updateAddress(DeliveryVO deliveryVO);

    //유저에 따른 배송지 삭제
    public List<DeliveryVO> deleteAddress(@Param("deliveryId") String deliveryId);

}
