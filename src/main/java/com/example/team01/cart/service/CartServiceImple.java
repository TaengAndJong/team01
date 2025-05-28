package com.example.team01.cart.service;

import com.example.team01.cart.dao.CartDao;
import com.example.team01.vo.CartVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class CartServiceImple implements CartService{

    private final CartDao dao;

    @Override
    public boolean checkBookCount(String bookId, int quantity) {
        //boolean 1이면 true, 0이하면 false
        boolean result = dao.checkBookCount(bookId, quantity); //true
        log.info("checkBookCount---result:{}", result);



        return false;
    }

    @Override
    public CartVO selectToCartList(String bookId, int quantity) {


        return null;
    }

    @Override
    public CartVO deleteToCartList(String cartId) {
        return null;
    }
}
