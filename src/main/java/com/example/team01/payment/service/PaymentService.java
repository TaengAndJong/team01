package com.example.team01.payment.service;

import com.example.team01.dto.address.AddressDTO;
import com.example.team01.dto.cart.CartDTO;
import com.example.team01.dto.payment.PaymentDTO;
import com.example.team01.dto.payment.PaymentListDTO;
import com.example.team01.vo.CartVO;
import com.example.team01.vo.PaymentListVO;
import com.example.team01.vo.PaymentVO;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface PaymentService {

    public List<CartDTO> selectCartList(String clientId);
    public int insertPayment(PaymentVO paymentVO,String clientId);//결제정보
    public int insertPaymentList(PaymentVO paymentVO);//결제내역 정보

    //mypage 결제내역 목록들조회
    public List<PaymentListDTO> selectPaymentList(String clientId);

}
