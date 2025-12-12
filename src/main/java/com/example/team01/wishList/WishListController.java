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
        result.put("currentPage", pagination.getCurrentPage());
        result.put("pageSize", pagination.getPageSize());
        result.put("totalPages", pagination.getTotalPages());
        result.put("totalRecord", pagination.getTotalRecord());
        return ResponseEntity.ok(result);
    }


    @PostMapping("/save")
    public ResponseEntity<?> saveWishList(
            @RequestParam(defaultValue = "1") int currentPage,
            @RequestParam(defaultValue = "4") int pageSize,
            @RequestParam Long bookId,
            @AuthenticationPrincipal PrincipalDetails principalDetails
            , HttpServletRequest request) {
        log.info("saveWishList-------:{}", bookId);

        Pagination pagination = new Pagination(currentPage, pageSize); //현재페이지 && 보여줄 페이지 수
        log.info("userWishList------pagination 갱신전:{}",pagination.getCurrentPage());
        log.info("userWishList------pagination 갱신전:{}",pagination.getPageSize());

        //클라이언트 정보 시큐리티로부터 받아오기
        String clientId = principalDetails.getUsername();
        pagination.setClientId(clientId);

        //service 로직 ==> Y 이면 N으로 업데이트 하는 쿼리
        WishStatus status = wishListService.insertWishList(clientId,bookId);

        //wishList 테이블에서 해당 유저의 찜목록 조회
        List< WishListVO> userWishList = wishListService.getWishList(pagination,request);
        //업데이트후 반환 값 확인
        log.info("userWishList갱신후:{}",userWishList); // 빈 배열 반환

        //해당페이지에 대한 total 반환값이  0 이면 currentPage를 앞 페이지로설정해서 반환해줘야함
        if(userWishList == null || userWishList.size() == 0){
            //페이지네이션 현재페이지 갱신설정
            log.info("페이지네이션 현재값 갱신설정필요---:{}",pagination.getCurrentPage()); // 빈 배열 반환
            //현재 페이지가 전체 페이지보다 클 경우, 전체페이지의 맨 마지막으로 현재페이지를 세팅한다
            int totalPage = pagination.getTotalPages();
            if( currentPage > totalPage) {
                //현재페이지만 재설정해서 클라이언트로 반환
                if (totalPage == 0) {
                    pagination.setCurrentPage(1); // 최소값 1로
                } else if (currentPage > totalPage) {
                    pagination.setCurrentPage(totalPage); // 마지막 페이지로 이동
                }
            }

        }

        log.info("userWishList갱신후:{}",userWishList); // 빈 배열 반환
        log.info("userWishList------pagination 갱신후 CurrentPage:{}",pagination.getCurrentPage()); // 2
        log.info("userWishList------pagination 갱신후 PageSize:{}",pagination.getPageSize()); // 4
        log.info("userWishList------pagination 갱신후 TotalRecord():{}",pagination.getTotalRecord()); //4
        log.info("userWishList------pagination 갱신후 TotalPages():{}",pagination.getTotalPages());// 1


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
                result.put("currentPage",pagination.getCurrentPage());
                result.put("pageSize",pagination.getPageSize());
                result.put("totalPages",pagination.getTotalPages());
                result.put("totalRecord",pagination.getTotalRecord());
                break;
            default:
                result.put("status","처리 실패");

        }

        log.info("result---------Update:{}",result);
        return ResponseEntity.ok(result);
    }

///mypage/wishlist/selectWishIds
    @GetMapping("/selectWishIds")
    public ResponseEntity<List<String>> selectWishIds(@AuthenticationPrincipal PrincipalDetails principalDetails) {

        List<String> result = wishListService.selectWishIds(principalDetails.getUsername());
        log.info("selectWishIds --- controller: result:{}",result);

        return ResponseEntity.ok(result);
    }



}
