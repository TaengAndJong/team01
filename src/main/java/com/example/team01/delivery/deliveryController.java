package com.example.team01.delivery;


import com.example.team01.delivery.service.AddressService;
import com.example.team01.security.PrincipalDetails;
import com.example.team01.vo.AddressVO;
import com.example.team01.vo.ClientVO;
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
    public ResponseEntity<?> saveAddress(@RequestBody AddressVO addressVO, @AuthenticationPrincipal PrincipalDetails userDetails) {
        log.info("saveAddress----------------------:{}",addressVO);
        //clientId 시큐리티에서 가져와 addressVO 객체에 담아주기
        String clientId = userDetails.getUsername();
       // 1:1
        ClientVO clientVO = new ClientVO();
        clientVO.setClientId(clientId);
        //addressVO로 clientVO 넘겨주기
        addressVO.setClient(clientVO);
        //서비스로 파라미터 넘겨주기
        int result = addressService.insertAddress(addressVO);
        log.info("saveAddress--result:{}",result);

        Map<String,Object> dummyList = new HashMap<>();
        dummyList.put("success",result);
        log.info("dummyList--result:{}",dummyList);
        return ResponseEntity.ok(dummyList);
    }


}
