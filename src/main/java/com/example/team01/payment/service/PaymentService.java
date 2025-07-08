package com.example.team01.payment.service;

import com.example.team01.dto.address.AddressDTO;
import com.example.team01.dto.cart.CartDTO;
import com.example.team01.vo.CartVO;
import com.example.team01.vo.PaymentVO;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface PaymentService {

    public List<CartDTO> selectCartList(String clientId);
    public AddressDTO selectAddress(String clientId);

}
