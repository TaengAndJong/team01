package com.example.team01.delivery.service;

import com.example.team01.dto.address.AddressDTO;
import com.example.team01.vo.AddressVO;
import com.example.team01.vo.DeliveryVO;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface AddressService {

    public List<AddressDTO> selectAddress(String clientId);

    public AddressDTO selectOneAddress(String clientId);

    // 유저에 따른 배송지 등록
    public int insertAddress(AddressVO addressVO);

    //유저에 따른 배송지 업데이트 ( deliveryId,
    public int updateAddress(AddressVO addressVO);

    //유저에 따른 배송지 삭제
    public int deleteAddress(String clientId,Long addrId);

    //장바구니에서 보여줄 주소 (처음 등록된 주소)
    public AddressDTO selectCartAddress(String clientId);

    //장바구니 배송지주소 선택변경
    public int updateCartAddress(String clientId, Long addrId);


}
