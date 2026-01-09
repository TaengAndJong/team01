package com.example.team01.address;

import com.example.team01.address.service.AddressService;
import com.example.team01.common.exception.BusinessException;
import com.example.team01.dto.address.AddressDTO;
import com.example.team01.security.PrincipalDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/address")
@RestController
public class AddressController {

    private final AddressService addressService;

    @GetMapping("/check")
    public ResponseEntity<?> checkAddress( @AuthenticationPrincipal PrincipalDetails userDetails) {

        String clientId = userDetails.getUsername();
        Map<String,Object> result = new HashMap<>();
        try {
            // 1)  클라이언트가 선택한 주소 데이터 ,기본으로 등록된 주소 있는지 확인 (isDefault 값 여부)
            AddressDTO address = addressService.selectOneAddress(clientId);
            result.put("address",address);

            return ResponseEntity.ok(result);  // 주소 있으면 200과 주소 데이터 반환
        } catch (BusinessException e) {
            result.put("message",e.getMessage());
            return ResponseEntity.badRequest()
                    .body(result);  // 주소 없으면 400과 메시지 반환
        }
    }
}



