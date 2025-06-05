package com.example.team01.cart;


import com.example.team01.book.service.BookService;
import com.example.team01.cart.service.CartService;
import com.example.team01.security.PrincipalDetails;
import com.example.team01.utils.FileUtils;
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

@Slf4j
@RequestMapping("/cart")
@RequiredArgsConstructor
@RestController
public class CartController {

    private final CartService cartService;
    private final FileUtils fileUtils;
    //http://localhost:5173/api/cart

    @GetMapping()
    public ResponseEntity<?> getCart(@AuthenticationPrincipal PrincipalDetails userDetails, HttpServletRequest request){ //securityContext에 저장된 사용자 정보 받아올 매개변수

        log.info("get Cart 입니다");
        //로그인한 user 정보
        String clientId = userDetails.getUsername();
        log.info("clientId --- login:{}",clientId);
        //클라이언트별 장바구니 목록에 데이터가 있을 경우

        //없을 경우

        List<CartVO> result = cartService.selectUserBookList(clientId);
        log.info("result---cartList 111111:{}",result);

        result.forEach(cartVO -> {
            BookVO bookVO= cartVO.getBookVO();
            fileUtils.changeImgPath(bookVO,request); // 클라이언트로 도서이미지 src값 설정 메서드
        });
        log.info("result---cartList 22222:{}",result);
        return  ResponseEntity.ok(result);
    }

    @PostMapping()
    public ResponseEntity<?> postCart(@RequestBody CartVO cartvo){


        //cartVO
        String bookId = cartvo.getBookId();
        int quantity = cartvo.getQuantity();
        //결과값 담아줄 map 
        Map<String, Object> result = new HashMap<>();

        try{

            if(bookId != null && !bookId.isEmpty()){
                //1.구입할 수 있는 수량이 존재하는지 확인
                boolean checkBookCnt= cartService.checkBookCount(bookId, quantity);
                log.info("checkBookCnt :{}", checkBookCnt);

                if(checkBookCnt){ //2. true이면  수량이 있다면
                    log.info("주문가능수량");
                    //2-1.도서 정보조회 ==> 도서 정보 조회할때 cart와 조인하기
                    CartVO cartBookInfo = cartService.selectBookInfo(bookId);
                    log.info("cartBookInfo---1 :{}", cartBookInfo);
                    //2-2 quantity, roleId, clientId 객체값 설정하기
                    // quantity
                    cartBookInfo.setQuantity(quantity);
                    //clientId
                    PrincipalDetails usrInfo = (PrincipalDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
                    cartBookInfo.setClientId(usrInfo.getUsername());
                    //roleId ==> usrInfo.getAuthorities().toString()으로하면 배열로 조회  ==> [ROLE_ADMIN] (에러유발)
                    String roleId = usrInfo.getAuthorities()
                            .stream()
                            .findFirst()
                            .map(GrantedAuthority::getAuthority)
                            .orElse(null);
                    log.info("roleId---2 :{}", roleId);
                    cartBookInfo.setRoleId(roleId);
                    log.info("cartBookInfo---2 :{}", cartBookInfo);
                    //Cart테이블에 inset 하기 ==> mybatis는 insert, update,delete 성공 시 숫자로 반환
                    int insertTocart = cartService.insertBook(cartBookInfo);
                    log.info("insertTocart=== :{}",insertTocart);
                }

             }else{ //false이면
                 //3.수량이 없으면
                    result.put("message","수량부족 판매지점에 문의해주세요.");
             }


        }catch(Exception e){
            //3.

            log.error("예외 발생: {}", e.getMessage(), e);  // 예외 내용 로그로 출력
            result.put("status", "error");

        }finally {
            //4.
        }
        //5.

        return  ResponseEntity.ok(result);

    }

}
