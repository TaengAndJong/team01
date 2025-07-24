package com.example.team01.mypage.payment;


import com.example.team01.dto.book.BookDTO;
import com.example.team01.dto.payment.PaymentCancelDTO;
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
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
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
        List<PaymentListDTO> paymentList = selectPaymentList(clientId,request);

        log.info("paymentList--End:{}",paymentList);
        return ResponseEntity.ok(paymentList);
    }

    //해당유저의 결제취소 요청 컨트롤러
    @PostMapping("/payCancel")
    public ResponseEntity<?> postPayCancelList(@RequestBody Map<String,List<String>> paymentInfo,
                                               @AuthenticationPrincipal PrincipalDetails userInfo,
                                               HttpServletRequest request) {
        // VO나DTO 객체타입으로 매핑하지 않아도 받아올 객체타입 직접 작성가능? 으로 이해해도 될까
        //==> @RequestBody Map<String,List<String>> paymentInfo
        log.info("postPayCancelList:{}",userInfo.getUsername());
        log.info("postPayCancelList-----paymentInfo:{}",paymentInfo);
        String clientId = userInfo.getUsername();

        // paymentInfo:{57=[17, 21], 61=[20, 19]} ==> String, List<String> 타입의 데이터를 
        //dtoList:[PaymentCancelDTO(payId=57, bookIds=[17, 21]), PaymentCancelDTO(payId=61, bookIds=[20, 19])] 
        // 반환타입 PaymentCacenDTO 타입으로 데이터 형식을 변형
        List<PaymentCancelDTO> dtoList = paymentInfo.entrySet().stream()
                .map(entry -> new PaymentCancelDTO(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
        log.info("dtoList--End:{}",dtoList);


        //여기에 try catch 구문 사용하는게 나은가! ==> 생각해보기
        // 한 번에 처리하는 메서드로 파라미터 넘겨 서비스에서 데이터 처리하기
        paymentService.cancelPaymentInfos(dtoList,clientId); 
        // 위의 서비스 로직이 성공처리되면  selectPaymentList(clientId,request) 실행하여 클라이언트로 데이터를 반환
        
        

        return ResponseEntity.ok("결제취소");
    }


    public List<PaymentListDTO> selectPaymentList(String clientId,HttpServletRequest request){
        List<PaymentListDTO> paymentList = paymentService.selectPaymentList(clientId);
        log.info("paymentList--controller:{}",paymentList);

        paymentList.forEach(dto -> {
            List<BookDTO> updatedBooks = dto.getBooks().stream()
                    .map(book -> fileUtils.changeImgPathDto(book, request))
                    .collect(Collectors.toList());
            log.info("updatedBooks--controller:{}",updatedBooks);
            dto.setBooks(updatedBooks);
        });
        return paymentList;
    }


}
