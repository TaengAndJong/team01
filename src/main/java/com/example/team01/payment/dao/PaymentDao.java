package com.example.team01.payment.dao;


import com.example.team01.vo.AddressVO;
import com.example.team01.vo.CartVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface PaymentDao {

    //문자열 clinetId를 받아서 반환되는 데이터들은 목록은 CartVO타입
    public List<CartVO> selectCartList(@Param("clientId") String clientId);


}
