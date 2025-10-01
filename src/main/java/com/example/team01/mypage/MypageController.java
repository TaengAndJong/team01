package com.example.team01.mypage;

import com.example.team01.common.service.ClientService;
import com.example.team01.payment.service.PaymentService;
import com.example.team01.security.PrincipalDetails;
import com.example.team01.userViewBook.dto.UserBookResponseDTO;
import com.example.team01.userViewBook.service.UserViewBookService;
import com.example.team01.wishList.service.WishListService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor //@RequiredArgsConstructor로 생성자 주입
@RequestMapping("/mypage")
@RestController
public class MypageController {

    //각 Service
    private final UserViewBookService userViewBookService;
    private final PaymentService paymentService;
    private final WishListService wishListService;

    //마이페이지 대시보드 공통
    @GetMapping("/mypageDashBoard")
    public ResponseEntity<?> getMypageDash(@AuthenticationPrincipal PrincipalDetails userInfo ) {
        log.info("getMypageDash------------------------------마이페이지 대시보드 요청들어오나요");
        // 로그인 세션 끊기면 로그인필요하다는 걸 예외처리 <<--------------------

        String clientId = userInfo.getUsername(); // 클라이언트 Id ==> 조회해올 데이터의 파라미터

        //사용자 조회 데이터
        List<UserBookResponseDTO> userViewBooks =userViewBookService.selectUserViewBook(clientId);
        //결제 건수 데이터

        //찜목록 건수 데이터

        //모든 문의에 대한 건수 데이터


        // 결과를 담아줄 Map객체
        Map<String, Object> result = new HashMap<>(); // 각 데이터객체의 타입이 다르기때문에 Object로 설정
        result.put("userViewBooks", userViewBooks);
//        result.put("", username);
//        result.put("payCnt", username);
//        result.put("wishCnt", username);
//
         log.info("mypageDahshBoard ----------:{}", result);
        //마이페이지 대시보드로 맵객체 반환
        return  ResponseEntity.ok(result);
    }

}
