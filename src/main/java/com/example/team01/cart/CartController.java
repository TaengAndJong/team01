package com.example.team01.cart;


import com.example.team01.book.service.BookService;
import com.example.team01.cart.service.CartService;
import com.example.team01.delivery.service.AddressService;
import com.example.team01.security.PrincipalDetails;
import com.example.team01.utils.FileUtils;
import com.example.team01.vo.AddressVO;
import com.example.team01.vo.BookVO;
import com.example.team01.vo.CartVO;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/* DI dependency injection ==>  필드 주입과 생성자 주입의 차이점


*/



@Slf4j
@RequestMapping("/cart")
@RequiredArgsConstructor
@RestController
public class CartController {

    // cartService 생성자 주입
    private final CartService cartService;
    //배송지
    private final AddressService addressService;
    // FileUtils 생성자 주입
    private final FileUtils fileUtils;
 

    @GetMapping()
    public ResponseEntity<?> getCart(@AuthenticationPrincipal PrincipalDetails userDetails, HttpServletRequest request){
        //securityContext에 저장된 사용자 정보 받아올 매개변수 = @AuthenticationPrincipal PrincipalDetails userDetails

        log.info("get Cart 입니다");
        //로그인한 user 정보
        String clientId = userDetails.getUsername();
        log.info("clientId --- login:{}",clientId);
        //기본 배송지 조회하기
        AddressVO selectAddr = addressService.selectCartAddress(clientId);
        log.info("addr------ 장바구니 기본배송지 조회: {}",selectAddr);


        //클라이언트별 장바구니 목록에 데이터가 있을 경우



        //없을 경우
        List<CartVO> bookList = cartService.selectUserBookList(clientId);
        log.info("result---cartList 111111:{}",bookList);

        bookList.forEach(cartVO -> {
            BookVO bookVO= cartVO.getBookVO();
            fileUtils.changeImgPath(bookVO,request); // 클라이언트로 도서이미지 src값 설정 메서드
        });
        log.info("result---cartList 22222:{}",bookList);

        Map<String,Object> result = new HashMap<>();
        result.put("bookList",bookList);
        result.put("address",selectAddr);

        log.info("result--------- controllerToclient:{}",result);
        return  ResponseEntity.ok(result);
    }

    @PostMapping()
    public ResponseEntity<?> postCart(@RequestBody CartVO cartvo,@AuthenticationPrincipal PrincipalDetails userDetails){

        log.info(" postCart  : {}",cartvo);

        //clientId
        String clientId = userDetails.getUsername();
        //cartVO
        log.info(" bookId  : {}",cartvo.getBookId());// 장바구니에 담을 도서 아이디
        log.info(" quantity  : {}",cartvo.getQuantity());// 장바구니에 담은 수량
        log.info(" clientId  : {}",clientId);

        // 서비스 파라미터로 넘길 유저 아이디 설정
        cartvo.setClientId(clientId);
        //cartService에  파라미터 넘겨주기
        cartService.insertBook(cartvo);

        //결과값 담아줄 map
        Map<String, Object> result = new HashMap<>();
        result.put("테스트",cartvo);

        return  ResponseEntity.ok(result);

    }

}
