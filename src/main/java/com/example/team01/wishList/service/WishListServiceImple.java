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

import java.util.ArrayList;
import java.util.Arrays;
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
                .forEach(vo -> {
                    List<String> imgArray = new ArrayList<>(); // 가변배열 리스트이면서, 값이 없어도 존재해야함 ( npx 방지 )
                    if(vo.getBookImgPath() != null && !vo.getBookImgPath().isEmpty()){
                        imgArray =  new ArrayList<>(
                                Arrays.asList(
                                        vo.getBookImgPath().split(",") //String [] 배열로 반환
                                )//Arrays.asList() 는 배열을 List로 => 고정크기 List
                        );// new ArrayList로 수정 가능한 새로운 가변 List 생성
                    }
                    // admingbookVO bookImgList에 담아주기
                    vo.setBookImgList(imgArray);
                });
        return wishList;
    }



    @Override
    public WishStatus insertWishList(String clientId, Long bookId) {
        //컨트롤러에게 반환할 cnt (마이바티스는 update, delete, insert 에대해서  int로 반환)

        String wish = wishListDao.wishStatusValue(clientId, bookId);
        log.info("wish value: {}", wish);

        if (wish == null) {
        // 최초 찜
        wishListDao.insertWishList(clientId, bookId);
        return WishStatus.INSERT;
        }

        if("Y".equals(wish)) {
            wishListDao.wishListStatus(clientId, bookId);
        return WishStatus.UPDATE;
        }

        if ("N".equals(wish)) {
        // 해제된 찜 다시 활성화
        wishListDao.wishListStatus(clientId, bookId);
        return WishStatus.UPDATE;
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
