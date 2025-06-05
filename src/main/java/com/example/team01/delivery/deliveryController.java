package com.example.team01.delivery;


import com.example.team01.delivery.service.AddressService;
import com.example.team01.security.PrincipalDetails;
import com.example.team01.vo.AddressVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;


import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Slf4j
@RequestMapping("/mypage/address")
@RequiredArgsConstructor
@RestController
public class deliveryController {

    private final  AddressService addressService;

    //@RequestParam String clientId
    @GetMapping()
    public ResponseEntity<?> getAddress(@AuthenticationPrincipal PrincipalDetails userDetails) {

        log.info("getAddress----------------------");
        // 로그인된 유저의 아이디 값 ==> 시큐리티에서 가져오기
        String clientId = userDetails.getUsername();
        log.info("clientId----------------------:{}", clientId);
        // 해당유저에 대한 배송지 목록 조회해오기
        List<AddressVO> addrList = addressService.selectAddress(clientId);
        log.info("addrList----------------------:{}", addrList);
        //Json 형식으로 자동 반환
        return ResponseEntity.ok(addrList);
    }

    //클라이언트의 배송지 설정
    @PostMapping("/save")
    public ResponseEntity<?> saveAddress(@RequestBody AddressVO addressVO) {
        log.info("saveAddress----------------------:{}",addressVO);

        Map<String,Object> dummyList = new HashMap<>();
        dummyList.put("id","1");

        return ResponseEntity.ok(dummyList);
    }


}
