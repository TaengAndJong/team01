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

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/payment")
@RestController
public class PaymentController {

     private final PaymentService paymentService;

    @GetMapping()
    public ResponseEntity<?> getPayment(@AuthenticationPrincipal PrincipalDetails userDetails ) {

        log.info("getPayment--------- get요청");
        String clientId = userDetails.getUsername();
        log.info("getPayment--------- clientId:{}",clientId);
        List<CartVO> list = paymentService.selectCartList(clientId);
        //PaymentVO paymentVO = paymentService.selectAddress(clientId); ==> mapper에 resultMap 해야함
        log.info("getPayment--------- list:{}",list);
       // log.info("getPayment--------- paymentVO:{}",paymentVO);

        // 결제 성공 목록 조회해서 데이터 클라이언트로 보내주기
        // 1)  클라이언트가 선택한 주소 데이터
        // 2) 결제테이블에추가된 장바구니 목록 정보

        //clientId = user02 인 주소 조회 ==> selectedAddrId를 cart 테이블 cartId 와 조인 데이터 조회

        // clientId = user02의 cartId = 26, 24, 25에 해당하는 값 조회
        //장바구니에 담긴 상태값을 컬럼으로 판단하지 않기 때문에 결제 완료후 기록삭제,
        //clientId로만 장바구니 조건 조회하여 장바구니 목록 데이터 조회

        return  ResponseEntity.ok("get요청");
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

