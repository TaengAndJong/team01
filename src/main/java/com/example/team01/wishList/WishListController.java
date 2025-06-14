package com.example.team01.wishList;


import com.example.team01.common.Enum.WishStatus;
import com.example.team01.security.PrincipalDetails;
import com.example.team01.utils.FileUtils;
import com.example.team01.vo.BookVO;
import com.example.team01.vo.WishListVO;
import com.example.team01.wishList.service.WishListService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/mypage/wishlist")
@RestController
public class WishListController {

    //생성자 주입을 하기위해 final 선언
    private final WishListService wishListService;
    private final FileUtils fileUtils;

    @GetMapping()
    public ResponseEntity<?> getWishList(@AuthenticationPrincipal PrincipalDetails principalDetails
            , HttpServletRequest request) {

        //wishList 테이블에 저장된 데이터 조회해 오기
        //필요 파라미터는 로그인한 유저의 Id == clientId
        String clientId = principalDetails.getUsername();
        List< WishListVO> userWishList =wishListService.getWishList(clientId);


        //stream API를 통해 내부를 순회, map을 통해 사용할 객체를 가져옴 , filter로 null예외 발생 방지
        userWishList.stream().map(WishListVO::getBookVO).filter(Objects::nonNull)
                .forEach(vo -> fileUtils.changeImgPath(vo,request));

        log.info("stream after userWishList------:{}",userWishList);

        Map<String,Object> result = new HashMap<>();
        result.put("userWishList",userWishList);

        log.info("userWishList----result:{}",userWishList);

        return ResponseEntity.ok(result);
    }

    @PostMapping("/save/{bookId}")
    public ResponseEntity<?> saveWishList(
            @PathVariable String bookId,
            @AuthenticationPrincipal PrincipalDetails principalDetails) {
        log.info("saveWishList-------:{}", bookId);
        //클라이언트 정보 시큐리티로부터 받아오기
        String clientId = principalDetails.getUsername();

        //클라이언트에게 반환할 값 담아줄 map객체
        Map<String,Object> result = new HashMap<>();


        //service 로직
        WishStatus status = wishListService.insertWishList(clientId,bookId);

        //반환되는 Enum 타입에 따른 switch문으로 상태메시지 분기
        switch(status){
            case INSERT :
                result.put("status","찜목록 추가완료");
                break;
            case UPDATE :
                result.put("status","찜목록 변경완료");
                break;
            default:
                result.put("status","처리 실패");

        }

        return ResponseEntity.ok(result);
    }





}
