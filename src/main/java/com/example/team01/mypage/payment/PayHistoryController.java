package com.example.team01.mypage.payment;


import com.example.team01.dto.book.BookDTO;
import com.example.team01.dto.payment.PaymentCancelDTO;
import com.example.team01.dto.payment.PaymentListDTO;
import com.example.team01.payment.service.PaymentService;
import com.example.team01.security.PrincipalDetails;
import com.example.team01.utils.FileUtils;
import com.example.team01.vo.PaymentListVO;
import com.example.team01.vo.PaymentQuantityVO;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
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
        //************* 전체삭제, 부분삭제 처리 구분 검증 필요
        Map<String,Boolean> confirm =isCancelAllpayment(dtoList,clientId);
        log.info("confirm--End:{}",confirm);
        // {81=false, 83=true}
        // confirm map객체 순회하여 해당 PayId에 대한 객체 paymentList payStatus 갱신해주기
        confirm.forEach((id,cancelAll)->{
            String payId = id;
            boolean isCancelAll = cancelAll;
            log.info("payId:{},isCancenAll:{}",payId,isCancelAll);
            //객체 paymentList payStatus 갱신 쿼리 실행

        });

        // 위의 서비스 로직이 성공처리되면  selectPaymentList(clientId,request) 실행하여 클라이언트로 데이터를 반환

        return ResponseEntity.ok("결제취소");
    }

    //결제리스트 조회 공통 메서드
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

    //전체 || 부분취소 분기 검증 메서드
    public Map<String, Boolean> isCancelAllpayment(List<PaymentCancelDTO> dtoList,String clientId){
    //PaymentCancelDTO 타입의 dtoList를 파라미터로 받아오기
        log.info("isCancelAllpayment -----:{}",dtoList);
        //dtoList의 bookIds의 결제 취소하려는 bookId의 개수가 quantity의 수량과 동일하지않으면 return false
        List<String> payIds = dtoList.stream().map(dto -> dto.getPayId()).collect(Collectors.toList());
        log.info("payIds--controller:{}",payIds);
        //paymentList에서 기존 결제 수량 quantity 조회오기
        List<PaymentQuantityVO> defaultQuantity = paymentService.selectPaymentQuantity(payIds);
        log.info("defaultQuantity--controller:{}",defaultQuantity);

        Map<String, Boolean> result = new HashMap<>();


        //디비에 저장되어있는 payId, bookIds 객체 순회
        for(PaymentQuantityVO vo : defaultQuantity){ 
            log.info("vo--isCancelAllpayment:{}",vo);
            String payId = vo.getPayId(); //기존 디비 저장된 payId
            //dtoList로 받아온 결제처리 데이터를 기존 디비의 데이터와 동일한 payId로 필터
            long cancelBookCount = dtoList.stream()
                    .filter(dto -> {
                        log.info("dto--isCancelAllpayment:{}",dto);
                        return dto.getPayId().equals(payId);})
                    .flatMap(dto -> { //결제에 대한 취소 도서상품 결제건수 
                        log.info("dto--isCancelAllpayment:{}",dto);
                        return dto.getBookIds().stream();
                    }).count(); // 수량반환
            
            log.info("cancelBookCount:{}",cancelBookCount);
            //PayId에 해당하는 totalBookCount 와 비교해서 isCancelAllpayment의 true, false반환
            int totalBookCount = vo.getTotalBookCount();
            log.info("payId:{},totalBookCount:{}",payId,totalBookCount);

            //true,false 반환 결정
            boolean isCancelAllpayment = cancelBookCount == totalBookCount;

            result.put(payId,isCancelAllpayment);
        }

        log.info("result--controller:{}",result);

        return result;
    }


}
