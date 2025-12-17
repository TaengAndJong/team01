package com.example.team01.wishList.service;

import com.example.team01.common.Enum.WishStatus;
import com.example.team01.utils.FileUtils;
import com.example.team01.utils.Pagination;
import com.example.team01.vo.WishListVO;
import com.example.team01.wishList.dao.WishListDao;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Slf4j
@RequiredArgsConstructor
@Transactional
@Service
public class WishListServiceImple implements WishListService {


    private final WishListDao wishListDao;
    private final FileUtils fileUtils;



    @Override
    public List<WishListVO> getWishList(Pagination pagination,HttpServletRequest request) {

        log.info("getWishList-----------1111:{}",pagination);
        //전체 데이터 레코드 조회해오기
       int total = wishListDao.totalRecord(pagination);

        log.info("total-----------1111:{}",total);
        // 전체페이지  설정해주기
        pagination.setTotalRecord(total);
       //startRow && endRow 설정
        pagination.setLimitRows();
        log.info("getWishList-----------2222:{}",pagination);
        // 데이터 조회
        List<WishListVO>  wishList = wishListDao.getWishList(pagination);
        log.info("wishListServiceImple---------------:{}",wishList);


        // 데이터 가져올 때 bookVO의 bookImgPath 변경 필요
        // stream API를 통해 내부를 순회, map을 통해 사용할 객체를 가져옴 , filter로 null예외 발생 방지
       
        wishList.stream().map(WishListVO::getBookVO).filter(Objects::nonNull)
                .forEach(vo -> fileUtils.changeImgPath(vo,request));

        return wishList;
    }



    @Override
    public WishStatus insertWishList(String clientId, Long bookId) {
        //컨트롤러에게 반환할 cnt (마이바티스는 update, delete, insert 에대해서  int로 반환)

        // 파리미터를 받아와서 존재여부 판단
        int exist = wishListDao.existWishList(clientId, bookId);
        //존재여부 로그 확인
        log.info("insertWishList-----exist: {} ", exist);

        if (exist > 0) { // 이미 있으면 wishStatus  'Y','N' 갱신
            int result = wishListDao.wishListStatus(clientId, bookId);

            // wishStatus 갱신 해줘야함
            log.info("insertWishList-----wishStatus:{}",result);
            if(result > 0) {
                log.info("wishStatus.update",WishStatus.UPDATE);
                return WishStatus.UPDATE;
            }
        }else{
            // 디비에 처음부터 존재하지 않으면 insert
            int result = wishListDao.insertWishList(clientId, bookId);
            if(result > 0) return WishStatus.INSERT;
        }
        return WishStatus.FAIL;
    }

    @Override
    public List<String> selectWishIds(String clientId) {

        log.info("clientId----------selectWishIds: {}",clientId);
        List<String> result = wishListDao.selectWishIds(clientId);
        log.info("result-----selectWishIds: {}",result);
        return result;
    }

    @Override
    public int selectWishCnt(String clientId) {
        log.info("3개월이낸 찜목록 건수 조회 : {}",clientId);
        return wishListDao.selectWishCnt(clientId);
    }


}
