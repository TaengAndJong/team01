package com.example.team01.cart.service;

import com.example.team01.vo.CartVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class CartServiceImple implements CartService{

    @Override
    public boolean checkBookCount(String bookId, int quantity) {


        return false;
    }

    @Override
    public CartVO insertToCartList(CartVO cartVO) {
        return null;
    }

    @Override
    public CartVO deleteToCartList(String cartId) {
        return null;
    }
}
