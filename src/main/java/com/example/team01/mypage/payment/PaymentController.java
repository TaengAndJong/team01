package com.example.team01.mypage.payment;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController("/mypage")
public class PaymentController {


    @GetMapping("/pay")
    public ResponseEntity<?> getPaySuccessList(){


        return null;
    }

}
