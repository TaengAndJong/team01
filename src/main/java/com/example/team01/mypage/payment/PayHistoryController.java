package com.example.team01.mypage.payment;


import com.example.team01.dto.book.BookDTO;
import com.example.team01.dto.payment.PaymentListDTO;
import com.example.team01.payment.service.PaymentService;
import com.example.team01.security.PrincipalDetails;
import com.example.team01.utils.FileUtils;
import com.example.team01.vo.PaymentListVO;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;


@Slf4j
@RequiredArgsConstructor// private final 서비스 주입시 필요
@RestController()
@RequestMapping("/mypage")
public class PayHistoryController {

    private final  PaymentService paymentService;
    private final FileUtils fileUtils;

    //해당유저의 결제완료 목록정보 조회
    @GetMapping("/payHistory")
    public ResponseEntity<?> getPaySuccessList(@AuthenticationPrincipal PrincipalDetails userInfo
    , HttpServletRequest request) {
        log.info("getPaySuccessList",userInfo);
        String clientId = userInfo.getUsername();
        //해당유저의 결제목록,배송지 주소 조회해오기
        List<PaymentListDTO> paymentList = paymentService.selectPaymentList(clientId);
        log.info("paymentList--controller:{}",paymentList);

        paymentList.forEach(dto -> {
            List<BookDTO> updatedBooks = dto.getBooks().stream()
                    .map(book -> fileUtils.changeImgPathDto(book, request)) // ✅ 각 BookDTO에 적용
                    .collect(Collectors.toList());
            dto.setBooks(updatedBooks); // ✅ 바뀐 book 리스트를 다시 세팅
        });

        return ResponseEntity.ok(paymentList);
    }


    //

}
