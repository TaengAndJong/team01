package com.example.team01.payment.service;

import com.example.team01.vo.CartVO;
import com.example.team01.vo.PaymentVO;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface PaymentService {

    public List<CartVO> selectCartList(String clientId);
    public PaymentVO selectAddress(String clientId);
}
