package com.example.team01.payment;


import com.example.team01.book.service.BookService;
import com.example.team01.cart.service.CartService;
import com.example.team01.delivery.service.AddressService;
import com.example.team01.dto.address.AddressDTO;
import com.example.team01.dto.book.BookDTO;
import com.example.team01.dto.cart.CartDTO;
import com.example.team01.payment.service.PaymentService;
import com.example.team01.security.PrincipalDetails;
import com.example.team01.utils.FileUtils;
import com.example.team01.vo.CartVO;
import com.example.team01.vo.PaymentVO;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/payment")
public class PaymentController {

     private final PaymentService paymentService;
     private final AddressService addressService;
     private final CartService cartService;
    private final FileUtils fileUtils;

    @GetMapping()
    public ResponseEntity<?> getPayment(@AuthenticationPrincipal PrincipalDetails userDetails, HttpServletRequest request) {
        // 결제 성공 목록 조회해서 데이터 클라이언트로 보내주기
        String clientId = userDetails.getUsername();
        // 2) 결제테이블에추가된 장바구니 목록 정보
        List<CartDTO> cartList = paymentService.selectCartList(clientId);
        log.info("bookList getPayment:{}---",cartList);
        //최종 반영할 장바구니 도서목록데이터
       List<CartDTO> bookList = cartList.stream().map(cartDTO -> {
                    //cartDTO 내부의 bookDTO 가져오기
                    BookDTO bookDTO = cartDTO.getBook();
                    log.info("changeImg----getPayment:{}",bookDTO);
                    //bookDto와 ,request 를 파라미터로 전송하여, bookImgPath 변경
                    fileUtils.changeImgPathDto(bookDTO,request); //bookImgpath가 변경된 DTO 반환
                    //최종 반환값은 CartDto 이기 때문에 CartDTO의 bookDTO 재설정
                    cartDTO.setBook(bookDTO);
                    log.info("fileUtis cartDTO : {}",cartDTO);
                    return cartDTO;// 변경된 데이터 반환
                }).collect(Collectors.toList());


        // 1)  클라이언트가 선택한 주소 데이터
        AddressDTO address = addressService.selectOneAddress(clientId);
        log.info("getPayment--------- list:{}",bookList);
        log.info("getPayment--------- address:{}",address);

        //장바구니에 담긴 상태값을 컬럼으로 판단하지 않기 때문에 결제 완료후 기록삭제,
        //clientId로만 장바구니 조건 조회하여 장바구니 목록 데이터 조회

        Map<String,Object> result = new HashMap<>();
        result.put("address",address); // address 내부 데이터 직접적으로 가져오기
        result.put("bookList",bookList);
        log.info("getPayment--------- result:{}",result);

        return  ResponseEntity.ok(result);
    }

    @PostMapping()
    public ResponseEntity<?> postPayment(@RequestBody PaymentVO paymentVO,@AuthenticationPrincipal PrincipalDetails userDetails) {
        // 결제한 데이터 결제 테이블에 넣어주기
        log.info("postPayment ------------------paymentVO:{}", paymentVO);
        // 1. Null 체크
        if (paymentVO == null) {
            return ResponseEntity.badRequest().body("결제 정보가 없습니다.");
        }

        // 2. 필수값 체크
        if (paymentVO.getPayAccount() <= 0 ||
                paymentVO.getPayMethod() == null ||
                paymentVO.getAddrId() == null || //주소값이 빠져서 에러 걸리는듯
                paymentVO.getBookList() == null ) {

            return ResponseEntity.badRequest().body("필수 결제 정보가 누락되었습니다.");
        }

        // 3. 도서 정보 체크
        for (CartVO cart : paymentVO.getBookList()) {
            if (cart.getBookId() == null || cart.getQuantity() <= 0) {
                return ResponseEntity.badRequest().body("도서 정보가 유효하지 않습니다.");
            }
        }
        //결제완료
        String clientId = userDetails.getUsername();
        // payment 결제정보테이블에 결제 데이터 insert (목적 : 결제 정보)
        paymentService.insertPayment(paymentVO,clientId);
        //payment_cart 결제내역테이블에 데이터 insert ( 목적: 도서정보조회 , 결제상세내역 조회 )
        paymentService.insertPaymentList(paymentVO);
        // 장바구니 목록에서 delete //cartIds=[26, 24, 25] 파라미터를 List로 전달 ==> IN 절 다중 조회(List 파라미터 IN 절) 사용해서 삭제
        if (paymentVO.getCartIds() != null && !paymentVO.getCartIds().isEmpty()) { //  바로구매의 경우 cartIds가 없기때문에 조건분기
            log.info("단건구매결제 삭제 왜 실행안돼냐아----- 장바구니 아이디가 없어서 여기에 안걸림:{}",paymentVO.getCartIds());
            cartService.deleteToCartList(paymentVO.getCartIds());
        }
        // 결제 완료 후 payId 넘겨주기 ==> SPA 경우에는 프론트에서 이동을 제어하는게 더 나음, payId를 공통으로 가지고 잇으니까 같이 넘겨줌
        return ResponseEntity.ok(Map.of("message", "결제 성공", "payId", paymentVO.getPayId()));
    }




}

