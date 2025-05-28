package com.example.team01.cart;


import com.example.team01.cart.service.CartService;
import com.example.team01.vo.CartVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
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
        //결과값 담아줄 map 
        Map<String, Object> result = new HashMap<>();

        log.info("bookId: {}", cartvo.getBookId());
        log.info("quantity: {}", cartvo.getQuantity());
        boolean checkBookCount = cartService.checkBookCount(cartvo.getBookId(), cartvo.getQuantity());

        if(!checkBookCount){
            result.put("message", "도서재고 부족");
            //보완 남은도서 수량도 같이 반환 ?
        }

        log.info("result: {}", checkBookCount);
        //수량이 있으면 장바구니 데이터베이스에 join을 통한 bookData 조회


        //Cart에 insert



        //json 형식으로 내보내기
        result.put("status", "success");

        return  ResponseEntity.ok(result);

    }

}
