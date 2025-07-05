package com.example.team01.payment.service;


import com.example.team01.payment.dao.PaymentDao;
import com.example.team01.vo.CartVO;
import com.example.team01.vo.PaymentVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class PaymentServiceImple implements PaymentService {

    private final PaymentDao dao;

    @Override
    public List<CartVO> selectCartList(String clientId) {

        List<CartVO> cartList = dao.selectCartList(clientId);
        log.info("cartList-------:{}",cartList);
        return cartList;
    }

    @Override
    public PaymentVO selectAddress(String clientId) {

        PaymentVO paymentVO = dao.selectAddress(clientId);
        log.info("paymentVO-------:{}",paymentVO);

        return paymentVO;
    }
}
