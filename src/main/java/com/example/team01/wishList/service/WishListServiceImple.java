package com.example.team01.wishList.service;

import com.example.team01.common.Enum.WishStatus;
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
    public WishStatus insertWishList(String clientId, String bookId) {
        //컨트롤러에게 반환할 cnt (마이바티스는 update, delete, insert 에대해서  int로 반환)


        // 파리미터를 받아와서 존재여부 판단
        int exist = wishListDao.existWishList(clientId, bookId);
        //존재여부 로그 확인
        log.info("insertWishList-----exist: {} ", exist);

        if (exist > 0) { // 이미 있으면 wishStatus  'Y','N' 갱신
            log.info("insertWishList-----wishStatus");
            int result = wishListDao.wishListStatus(clientId, bookId);
            if(result > 0) return WishStatus.UPDATE;
        }else{
            // 디비에 처음부터 존재하지 않으면 insert
            int result = wishListDao.insertWishList(clientId, bookId);
            if(result > 0) return WishStatus.INSERT;
        }
        return WishStatus.FAIL;
    }


}
