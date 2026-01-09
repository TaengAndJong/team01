package com.example.team01.address.dao;

import com.example.team01.vo.AddressVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AddressDao {

         List<AddressVO> selectAddress(@Param("clientId") String clientId);

        //결제 배송지로 선택한 주소 조회
         AddressVO selectOneAddress(@Param("clientId") String clientId);

        // 유저에 따른 배송지 등록
         int insertAddress(AddressVO addressVO);

        //유저에 따른 배송지 업데이트 ( deliveryId,
         int updateAddress(AddressVO addressVO);

        //유저에 따른 배송지 삭제
         int deleteAddress( @Param("addrId") Long addrId,@Param("clientId") String clientId);

        //장바구니에서 보여줄 주소 (처음 등록된 주소)
         List<AddressVO> selectCartAddress(@Param("clientId") String clientId);

        //장바구니 배송지주소 선택변경
         int updateChangeCartAddress(@Param("clientId") String clientId, @Param("addrId") Long addrId);

        //장바구니에서 보여줄 주소조회 (선택으로 변경된 주소)
         AddressVO selectChangeAddress(@Param("clientId") String clientId,@Param("addrId") Long addrId);

         //기본주소 존재유무 조회
        int isDefaultStatus(@Param("clientId") String clientId);

        //기본주소변경 시 초기화
        int clearDefaultStatus(@Param("clientId") String clientId);

}
