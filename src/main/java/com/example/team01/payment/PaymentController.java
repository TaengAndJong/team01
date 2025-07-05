package com.example.team01.payment;


import com.example.team01.payment.service.PaymentService;
import com.example.team01.security.PrincipalDetails;
import com.example.team01.vo.CartVO;
import com.example.team01.vo.PaymentVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/payment")
@RestController
public class PaymentController {

     private final PaymentService paymentService;

    @GetMapping()
    public ResponseEntity<?> getPayment(@AuthenticationPrincipal PrincipalDetails userDetails ) {
        // 결제 성공 목록 조회해서 데이터 클라이언트로 보내주기
        String clientId = userDetails.getUsername();
        // 2) 결제테이블에추가된 장바구니 목록 정보
        List<CartVO> bookList = paymentService.selectCartList(clientId);
        // 1)  클라이언트가 선택한 주소 데이터
        PaymentVO address = paymentService.selectAddress(clientId);
        log.info("getPayment--------- list:{}",bookList);
        log.info("getPayment--------- paymentVO:{}",address);

        //장바구니에 담긴 상태값을 컬럼으로 판단하지 않기 때문에 결제 완료후 기록삭제,
        //clientId로만 장바구니 조건 조회하여 장바구니 목록 데이터 조회

        Map<String,Object> result = new HashMap<>();
        result.put("address",address.getAddressVO()); // address 내부 데이터 직접적으로 가져오기
        result.put("bookList",bookList);
        log.info("getPayment--------- result:{}",result);

        return  ResponseEntity.ok(result);
    }

    @PostMapping()
    public ResponseEntity<?> postPayment(@RequestBody PaymentVO paymentVO) {
        // 결제한 데이터 결제 테이블에 넣어주기
        log.info("postPayment ------------------paymentVO:{}", paymentVO);
        //paymentVO:PaymentVO(payId=null, payAccount=40008, payStatus=null, payDate=null, cartIds=[26, 24, 25], addrId=10)

        // payment테이블에 결제 데이터 insert
        
        return  ResponseEntity.ok("post요청");
    }

    @PostMapping("success")
    public ResponseEntity<?> postSuccessPayment(@RequestBody PaymentVO paymentVO) {
        // 결제한 데이터 결제 테이블에 넣어주기
        log.info("postSuccessPayment ------------------paymentVO:{}", paymentVO);


        return  ResponseEntity.ok("post요청");
    }


}

