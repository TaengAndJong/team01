package com.example.team01.wishList.service;

import com.example.team01.vo.WishListVO;
import com.example.team01.wishList.dao.WishListDao;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class WishListServiceImple implements WishListService {


    private final WishListDao wishListDao;

    @Override
    public List<WishListVO> getWishList(String clientId) {
        return List.of();
    }

    @Override
    public int insertWishList(String clientId, String bookId) {

        int cnt = 0;

        try{
           return cnt =  wishListDao.insertWishList(clientId, bookId);
        }catch (Exception e){
            e.printStackTrace();
        }

        return cnt;
    }

    @Override
    public int deleteWishList(String clientId, String bookId) {
        return 0;
    }
}
