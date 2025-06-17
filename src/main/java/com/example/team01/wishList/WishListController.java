package com.example.team01.wishList;


import com.example.team01.common.Enum.WishStatus;
import com.example.team01.security.PrincipalDetails;
import com.example.team01.utils.FileUtils;
import com.example.team01.utils.Pagination;
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
    public ResponseEntity<?> getWishList(
            @RequestParam(defaultValue = "1") int currentPage,
            @RequestParam(defaultValue = "4") int pageSize,
            @AuthenticationPrincipal PrincipalDetails principalDetails
            , HttpServletRequest request) {
        log.info("도서 찜목록 API 호출됨");
        //페이지 계산 클래스 불러오기
        Pagination pagination = new Pagination(currentPage, pageSize); //현재페이지 && 보여줄 페이지 수
        log.info("userWishList------pagination:{}",pagination);
        //필요 파라미터는 로그인한 유저의 Id == clientId
        String clientId = principalDetails.getUsername();
        pagination.setClientId(clientId);
        
        //wishList 테이블에 저장된 데이터 조회해 오기
        List< WishListVO> userWishList = wishListService.getWishList(pagination,request);

        //디비로부터 조회해온 데이터들
        log.info("stream after userWishList------:{}",userWishList);

        Map<String,Object> result = new HashMap<>();
        result.put("userWishList",userWishList);
        result.put("currentPage", pagination.getCurrentPage());
        result.put("pageSize", pagination.getPageSize());
        result.put("totalPages", pagination.getTotalPages());
        result.put("totalRecord", pagination.getTotalRecord());

        log.info("userWishList----result:{}",result);

        return ResponseEntity.ok(result);
    }


    @PostMapping()
    public ResponseEntity<?> postSearchWishList(
            @RequestParam(required = false) String bookType,
            @RequestParam(required = false) String searchType,
            @RequestParam String keyword,
            @RequestParam(defaultValue = "1") int currentPage,
            @RequestParam(defaultValue = "4") int pageSize,
            @AuthenticationPrincipal PrincipalDetails principalDetails
            , HttpServletRequest request) {
        log.info("도서 목록 searchkeyword API 호출됨");
        log.info("bookType --------------------: {}",bookType);
        log.info("searchType -------------------: {}",searchType);
        log.info("keyword -----------------: {}",keyword);
        log.info("userWishList------currentPage:{},pageSize:{}",currentPage,pageSize);
        //페이지 계산 클래스 불러오기
        Pagination pagination = new Pagination(currentPage, pageSize); //현재페이지 && 보여줄 페이지 수
        log.info("pagination -----------------: {}",pagination);
        //검색필터 설정해주기
        pagination.addDetailCondition("bookType", bookType);
        pagination.addDetailCondition("searchType", searchType);
        pagination.addDetailCondition("keyword", keyword);

        log.info("DetailContion-----:{}",pagination.getDetailCondition());

        //필요 파라미터는 로그인한 유저의 Id == clientId
        String clientId = principalDetails.getUsername();
        pagination.setClientId(clientId);

        //wishList 테이블에 저장된 데이터 조회해 오기
        List< WishListVO> userWishList = wishListService.getWishList(pagination,request);


        log.info("stream after userWishList------:{}",userWishList);

        Map<String,Object> result = new HashMap<>();
        result.put("userWishList",userWishList);

        log.info("userWishList----result:{}",userWishList);

        return ResponseEntity.ok(result);
    }


    @PostMapping("/save/{bookId}")
    public ResponseEntity<?> saveWishList(
            @RequestParam(defaultValue = "1") int currentPage,
            @RequestParam(defaultValue = "4") int pageSize,
            @PathVariable String bookId,
            @AuthenticationPrincipal PrincipalDetails principalDetails
            , HttpServletRequest request) {
        log.info("saveWishList-------:{}", bookId);

        Pagination pagination = new Pagination(currentPage, pageSize); //현재페이지 && 보여줄 페이지 수
        log.info("userWishList------pagination:{}",pagination);

        //클라이언트 정보 시큐리티로부터 받아오기
        String clientId = principalDetails.getUsername();
        pagination.setClientId(clientId);

        //service 로직
        WishStatus status = wishListService.insertWishList(clientId,bookId);

        //wishList 테이블에 저장된 데이터 조회해 오기
        List< WishListVO> userWishList = wishListService.getWishList(pagination,request);

        //클라이언트에게 반환할 값 담아줄 map객체
        Map<String,Object> result = new HashMap<>();

        //반환되는 Enum 타입에 따른 switch문으로 상태메시지 분기
        switch(status){
            case INSERT :
                result.put("status","찜목록 추가완료");
                break;
            case UPDATE :
                result.put("status","찜목록 변경완료");
                result.put("userWishList",userWishList);
                break;
            default:
                result.put("status","처리 실패");

        }

        return ResponseEntity.ok(result);
    }





}
