package com.example.team01.wishList.service;

import com.example.team01.common.Enum.WishStatus;
import com.example.team01.utils.FileUtils;
import com.example.team01.vo.WishListVO;
import com.example.team01.wishList.dao.WishListDao;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Slf4j
@RequiredArgsConstructor
@Service
public class WishListServiceImple implements WishListService {


    private final WishListDao wishListDao;
    private final FileUtils fileUtils;

    @Override
    public List<WishListVO> getWishList(String clientId, HttpServletRequest request) {
        
        log.info("getWishList----: {} ", clientId);
        // 데이터 조회
        List<WishListVO>  wishList = wishListDao.getWishList(clientId);
        
        // 데이터 가져올 때 bookVO의 bookImgPath 변경 필요
        // stream API를 통해 내부를 순회, map을 통해 사용할 객체를 가져옴 , filter로 null예외 발생 방지
        wishList.stream().map(WishListVO::getBookVO).filter(Objects::nonNull)
                .forEach(vo -> fileUtils.changeImgPath(vo,request));

        return wishList;
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
