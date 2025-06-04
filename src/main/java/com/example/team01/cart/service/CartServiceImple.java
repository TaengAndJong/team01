package com.example.team01.cart.service;

import com.example.team01.book.dao.BookDao;
import com.example.team01.cart.dao.CartDao;
import com.example.team01.utils.FileUtils;
import com.example.team01.vo.BookVO;
import com.example.team01.vo.CartVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class CartServiceImple implements CartService{

    private final CartDao dao;
    private final FileUtils fileUtils;


    @Override
    public boolean checkBookCount(String bookId, int quantity) {
        //boolean 1이면 true, 0이하면 false
        boolean result = dao.checkBookCount(bookId, quantity); //true
        log.info("checkBookCount---result:{}", result);

        return result;
    }

    @Override
    public CartVO selectBookInfo(String bookId) {

        CartVO bookInfo = dao.selectBookInfo(bookId);
        log.info("selectBookInfo--------serviceImple:{}",bookInfo);
        return bookInfo;

    }

    @Override
    public int insertBook(CartVO bookInfo) {
        log.info("insertBook--------serviceImple:{}",bookInfo);
        int cnt =  dao.insertBook(bookInfo);
        return cnt;
    }

    @Override
    public List<CartVO> selectUserBookList(String clientId) {
        log.info("장바구니 도서목록 조회:{}",clientId);
        List<CartVO> bookList = dao.selectUserBookList(clientId);


        return bookList;
    }


    @Override
    public CartVO deleteToCartList(String cartId) {
        return null;
    }
}
