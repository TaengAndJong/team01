package com.example.team01.delivery.dao;

import com.example.team01.vo.AddressVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AddressDao {

    public List<AddressVO> selectAddress(@Param("clientId") String clientId);

    // 유저에 따른 배송지 등록
    public int insertAddress(AddressVO addressVO);

    //유저에 따른 배송지 업데이트 ( deliveryId,
    public int updateAddress(AddressVO addressVO);

    //유저에 따른 배송지 삭제
    public int deleteAddress(@Param("addrId") String deliveryId);

}
