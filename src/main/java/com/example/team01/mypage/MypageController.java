package com.example.team01.mypage;

import com.example.team01.common.service.ClientService;
import com.example.team01.dto.book.BookDTO;
import com.example.team01.payment.service.PaymentService;
import com.example.team01.security.PrincipalDetails;
import com.example.team01.userViewBook.dto.UserBookResponseDTO;
import com.example.team01.userViewBook.service.UserViewBookService;
import com.example.team01.utils.FileUtils;
import com.example.team01.wishList.service.WishListService;
import jakarta.servlet.http.HttpServletRequest;
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
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor //@RequiredArgsConstructor로 생성자 주입
@RequestMapping("/mypage")
@RestController
public class MypageController {

    //각 Service
    private final UserViewBookService userViewBookService;
    private final PaymentService paymentService;
    private final WishListService wishListService;
    private final FileUtils fileUtils;

    //마이페이지 대시보드 공통
    @GetMapping("/mypageDashBoard")
    public ResponseEntity<?> getMypageDash(@AuthenticationPrincipal PrincipalDetails userInfo,
                                           HttpServletRequest request) {
        log.info("getMypageDash------------------------------마이페이지 대시보드 요청들어오나요");
        // 로그인 세션 끊기면 로그인필요하다는 걸 예외처리 <<--------------------

        String clientId = userInfo.getUsername(); // 클라이언트 Id ==> 조회해올 데이터의 파라미터

        //사용자 조회 데이터
        List<UserBookResponseDTO> selectViewBooks =userViewBookService.selectUserViewBook(clientId);
        //도서 이미지 경로에 서버주소 추가
        List<UserBookResponseDTO> userViewBooks
                = selectViewBooks.stream() // Stream<UserBookResponseDTO> 로 변환
                .map(dto -> { // map을 통해 순회하면서 데이터변환
                    BookDTO book = dto.getBook();
                    //book 이미지 경로변경 ==> dto 반환됨
                    fileUtils.changeImgPathDto(book, request);
                    //반환 Dto book 객체 재설정
                    dto.setBook(book);
                    // 최종 결과 반환
                    return dto;
                }).collect(Collectors.toList()); // 흩어진 데이터를 리스트로 모아 반환

        //결제 건수 데이터
        int payCnt = paymentService.selectPaymentCnt(clientId);
        log.info("payCnt-----------------------------:{}", payCnt);
        //찜목록 건수 데이터
        int wishCnt = wishListService.selectWishCnt(clientId);

        //모든 문의에 대한 건수 데이터


        // 결과를 담아줄 Map객체
        Map<String, Object> result = new HashMap<>(); // 각 데이터객체의 타입이 다르기때문에 Object로 설정
        result.put("userViewBooks", userViewBooks);
        result.put("payCnt", payCnt);
        result.put("wishCnt", wishCnt);

         log.info("mypageDahshBoard ----------:{}", result);
        //마이페이지 대시보드로 맵객체 반환
        return  ResponseEntity.ok(result);
    }

}
