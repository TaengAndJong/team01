package com.example.team01.cart;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RequestMapping("cart")
@RequiredArgsConstructor
@RestController
public class CartController {

    @GetMapping("cartList")
    public ResponseEntity<?> getCart(){
        log.info("카트리스트 입니다");

        return  ResponseEntity.ok("cartLIst");
    }

}
