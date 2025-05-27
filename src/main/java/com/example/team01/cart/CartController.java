package com.example.team01.cart;


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

    @GetMapping("/cartList")
    public ResponseEntity<?> getCart(){
        log.info("get Cart 입니다");

        return  ResponseEntity.ok("cartLIst");
    }

    @PostMapping("/cartList")
    public ResponseEntity<?> postCart(@RequestBody List<CartVO> cartList){
        
        //클라이언트에서 받아온 bookId와 quantity 
        for (CartVO item : cartList) {
            // 장바구니에 insert할 객체값 설정해주기
            log.info("bookId: {}", item.getBookId());
            log.info("quantity: {}", item.getQuantity());
        }
        //json 형식으로 내보내기
        Map<String, Object> result = new HashMap<>();
        result.put("status", "success");

        return  ResponseEntity.ok(result);

    }

}
