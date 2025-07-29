package com.example.team01.delivery.dao;

import com.example.team01.vo.AddressVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AddressDao {

    public List<AddressVO> selectAddress(@Param("clientId") String clientId);
    
    //결제 배송지로 선택한 주소 조회
    public AddressVO selectOneAddress(@Param("clientId") String clientId);

    // 유저에 따른 배송지 등록
    public int insertAddress(AddressVO addressVO);

    //유저에 따른 배송지 업데이트 ( deliveryId,
    public int updateAddress(AddressVO addressVO);

    //유저에 따른 배송지 삭제
    public int deleteAddress( @Param("addrId") String addrId,@Param("clientId") String clientId);

    //장바구니에서 보여줄 주소 (처음 등록된 주소)
    public List<AddressVO> selectCartAddress(@Param("clientId") String clientId);

    //장바구니 배송지주소 선택변경
    public int updateCartAddress(@Param("clientId") String clientId, @Param("addrId") String addrId);

    //장바구니에서 보여줄 주소조회 (선택으로 변경된 주소)
    public AddressVO selectChangeAddress(@Param("clientId") String clientId,@Param("addrId") String addrId);


}
