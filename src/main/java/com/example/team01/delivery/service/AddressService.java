package com.example.team01.delivery.service;

import com.example.team01.vo.AddressVO;
import com.example.team01.vo.DeliveryVO;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface AddressService {

    public List<AddressVO> selectAddress(String clientId);

    // 유저에 따른 배송지 등록
    public int insertAddress(AddressVO addressVO);

    //유저에 따른 배송지 업데이트 ( deliveryId,
    public int updateAddress(AddressVO addressVO);

    //유저에 따른 배송지 삭제
    public int deleteAddress(String clientId,String addrId);


}
