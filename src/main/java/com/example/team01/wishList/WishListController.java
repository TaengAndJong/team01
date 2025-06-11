package com.example.team01.wishList;


import com.example.team01.security.PrincipalDetails;
import com.example.team01.wishList.service.WishListService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RequestMapping("/mypage/wishlist")
@RestController
public class WishListController {

    WishListService wishListService;

    @GetMapping()
    public ResponseEntity<?> getWishList() {
        return null;
    }

    @PostMapping("/save/{bookId}")
    public ResponseEntity<?> saveWishList(
            @PathVariable String bookId,
            @AuthenticationPrincipal PrincipalDetails principalDetails) {
        log.info("saveWishList-------:{}", bookId);
        //클라이언트 정보 시큐리티로부터 받아오기
        String clientId = principalDetails.getUsername();
        log.info("saveWishList-------:{}", clientId);
        //클라이언트에게 반환할 값 담아줄 map객체
        Map<String,Object> result = new HashMap<>();
        
        // 위시리트스에 정보 저장하기
        try{
            int cnt =  wishListService.insertWishList(clientId, bookId);

            if (cnt > 0){
                result.put("success","찜목록 추가완료");
                // result에 추가된 객체의 정보를 조회해서 클라이언트에 보여줄 건가 ?
            }

        }catch (Exception e){
            e.printStackTrace();
        }


        return ResponseEntity.ok(result);
    }

    @PostMapping("/delete/{bookId}")
    public ResponseEntity<?> deleteWishList(
            @PathVariable String bookId,
            @AuthenticationPrincipal PrincipalDetails principalDetails) {

        return null;
    }




}
