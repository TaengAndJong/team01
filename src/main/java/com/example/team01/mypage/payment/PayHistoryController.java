package com.example.team01.mypage.payment;


import com.example.team01.common.Enum.PayStatus;
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

import java.util.*;
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

    //해당유저의 결제취소 한 건 요청 컨트롤러
    @PostMapping("/payCancel")
    public ResponseEntity<?> postPayCancel(@RequestBody PaymentListVO params,
                                               @AuthenticationPrincipal PrincipalDetails userInfo,
                                               HttpServletRequest request) {
        // VO나DTO 객체타입으로 매핑하지 않아도 받아올 객체타입 직접 작성가능? 으로 이해해도 될까
        //==> @RequestBody Map<String,List<String>> paymentInfo
        log.info("postPayCancelList:{}",userInfo.getUsername());
        log.info("postPayCancelList-----params:{}",params);
        String clientId = userInfo.getUsername();
        Long payId = params.getPayId();
        Long bookId = params.getBookId();

        // 개별결제취소 서비스로 파라미터 전달
        paymentService.partialCancel(payId,clientId,bookId);

        // 위의 서비스 로직이 성공처리되면  selectPaymentList(clientId,request) 실행하여 클라이언트로 데이터를 반환
        //해당유저의 결제목록,배송지 주소 조회해오기
        List<PaymentListDTO> paymentList = selectPaymentList(clientId,request); // 클라이언트의 모든 결제내역 조회 쿼리
        log.info("paymentList-----postPayCancelList--여기여기:{}",paymentList);

        //부분취소를 통한 전체취소가 될 경우에는 paymentList의 조회 데이터를 payId 를 기준으로 필터링 후, cancel 검증필요
          boolean canceledAll = paymentList.stream()
                            .filter(dto-> dto.getPayId().equals(payId))
                            .flatMap(dto -> dto.getBooks().stream())
                            .allMatch(book -> PayStatus.CANCEL.name().equals(book.getPartPayStatus()));
        log.info("paymentList-----postPayCancelList-- canceledAll:{}",canceledAll);


        if(canceledAll){ // 전체취소이면
            List<Long> bookIds = paymentList.stream()
                    .filter(dto-> dto.getPayId().equals(payId))
                    .flatMap(books -> books.getBooks().stream())// ==> 이중배열구조에서 [bookDTO,bookDTO,bookDTO]로 변형
                    .map(BookDTO::getBookId).collect(Collectors.toList());  // 각객체에서 bookId만 모아서 반환

            int result = paymentService.allCancel(payId,bookIds,clientId);

            log.info("paymentList-----postPayCancelList--true");
            //전체취소시 반환
            // result가 1이면 어떤거 반환 ?
            if(result > 0){
                //해당유저의 결제목록,배송지 주소 조회해오기
                paymentList = selectPaymentList(clientId,request);
                log.info("전체취소되면 :{}",paymentList);
            }
            log.info("result----- 전체취소 처리완료:{}",result); // 전체취소 처리완료
        }

        //공통 코드
        log.info("paymentList----ended--:{}",paymentList);
        return ResponseEntity.ok(paymentList);
    }


    @PostMapping("/payAllCancel")
    public ResponseEntity<?> postAllCancel(@RequestBody  PaymentCancelDTO params,
                                           @AuthenticationPrincipal PrincipalDetails userInfo,
                                           HttpServletRequest request){
        log.info("postAllCancelList params :{}",params);
        log.info("params.getPayId() :{}",params.getPayId());
        log.info("params.getBookIds() :{}",params.getBookIds());

        String clientId = userInfo.getUsername();
    // [PaymentCancelDTO(payId=101, bookId=null, partPayStatus=null, bookIds=[16, 17], payIds=null)]
    //1.paymentList 테이블에서 partPayStatus가 cancel인경우를 제외하고 partPayStatus 상태 cancel로 갱신하기

        Long payId = params.getPayId();
        List<Long> bookIds = params.getBookIds();
        //서비스로 파라미터 넘겨주기
        int result =  paymentService.allCancel(payId,bookIds,clientId); //int 탕비
        log.info("result-----paymentController:{}",result);

        // result가 1이면 어떤거 반환 ?
        if(result > 0){
            //해당유저의 결제목록,배송지 주소 조회해오기
            List<PaymentListDTO> paymentList = selectPaymentList(clientId,request);
            return ResponseEntity.ok(paymentList);
        }

        return ResponseEntity.ok("전체결제취소 실패");
    }


    //결제리스트 조회 공통 메서드
    public List<PaymentListDTO> selectPaymentList(String clientId,HttpServletRequest request){
        List<PaymentListDTO> paymentList = paymentService.selectPaymentList(clientId);
        log.info("paymentList--controller:{}",paymentList);

        paymentList.forEach(dto -> {
            List<BookDTO> updatedBooks = dto.getBooks().stream()
                    .map(book -> {
                        List<String> imgArray = new ArrayList<>(); // 가변배열 리스트이면서, 값이 없어도 존재해야함 ( npx 방지 )
                        if(book.getBookImgPath() != null && !book.getBookImgPath().isEmpty()){
                            imgArray =  new ArrayList<>(
                                    Arrays.asList(
                                            book.getBookImgPath().split(",") //String [] 배열로 반환
                                    )//Arrays.asList() 는 배열을 List로 => 고정크기 List
                            );// new ArrayList로 수정 가능한 새로운 가변 List 생성
                        }
                        book.setBookImgList(imgArray);
                        return book;
                    })
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
        List<Long> payIds = dtoList.stream().map(dto -> dto.getPayId()).collect(Collectors.toList());
        log.info("payIds--controller:{}",payIds);
        //paymentList에서 기존 결제 수량 quantity 조회오기
        List<PaymentQuantityVO> defaultQuantity = paymentService.selectPaymentQuantity(payIds);
        log.info("defaultQuantity--controller:{}",defaultQuantity);

        Map<String, Boolean> result = new HashMap<>();


        //디비에 저장되어있는 payId, bookIds 객체 순회
        for(PaymentQuantityVO vo : defaultQuantity){ 
            log.info("vo--isCancelAllpayment:{}",vo);
            Long payId = vo.getPayId(); //기존 디비 저장된 payId
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

            result.put(String.valueOf(payId),isCancelAllpayment);
        }

        log.info("result--controller:{}",result);

        return result;
    }


}
