package com.example.team01.cart;


import com.example.team01.book.service.BookService;
import com.example.team01.cart.service.CartService;
import com.example.team01.security.PrincipalDetails;
import com.example.team01.vo.BookVO;
import com.example.team01.vo.CartVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
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


    @GetMapping("/cartList")
    public ResponseEntity<?> getCart(){
        log.info("get Cart 입니다");

        return  ResponseEntity.ok("cartLIst");
    }

    @PostMapping("/cartList")
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
                    log.info("cartBookInfo :{}", cartBookInfo);
                    //2-2 quantity, roleId, clientId 객체값 설정하기
                    cartBookInfo.setQuantity(quantity); // quantity
                    //roleId && clientId


                    log.info("cartBookInfo---2 :{}", cartBookInfo);



                    //  log.info("insert cart success", cartService.insertBook(bookVO));
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
