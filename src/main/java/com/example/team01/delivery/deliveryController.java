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
        int insertData = addressService.insertAddress(addressVO);
        log.info("saveAddress--result:{}",insertData);




        Map<String,Object> result = new HashMap<>();
        result.put("success","배송지 저장성공");
        result.put("saveData","addressVO");

        log.info("dummyList--result:{}",result);
        return ResponseEntity.ok(result);
    }


    //배송지 삭제
    @PostMapping("/delete/{addrId}")
    public ResponseEntity<?> deleteAddress(@PathVariable String addrId,
                                           @AuthenticationPrincipal PrincipalDetails userDetails) {

        log.info("deleteAddress----------------------:{}",addrId);
        String clientId = userDetails.getUsername();
        ClientVO clientVO = new ClientVO();
        clientVO.setClientId(clientId);

        //삭제 쿼리에 사용할 파라미터 넘겨주기
        int deleteData =  addressService.deleteAddress(clientId,addrId);
        log.info("deleteAddress----------------------:{}",deleteData);
        //응답 시 클라이언트에 전달할 데이터 맵
        Map<String,Object> result = new HashMap<>();
       
        // addrId를 사용하여 삭제 로직 수행
        if(deleteData>0){
            result.put("success","해당 배송지 삭제완료");

        }

        log.info("deleteData--result:{}",result);
        return ResponseEntity.ok(result);
    }


    //배송지 업데이트
    @PostMapping("/update/{addrId}")
    public ResponseEntity<?> updateAddress(@RequestBody AddressVO addressVO,
                                           @AuthenticationPrincipal PrincipalDetails userDetails) {

        log.info("왜 객체를 못받아오니??----------------------addressVO:{}",addressVO);
        log.info("updateAddress----------------------userDetails:{}",userDetails);


        //삭제 쿼리에 사용할 파라미터 넘겨주기
        int updateData =  addressService.updateAddress(addressVO);
        log.info("updateAddress----------------------:{}",updateData);
        //응답 시 클라이언트에 전달할 데이터 맵
        Map<String,Object> result = new HashMap<>();

        // addrId를 사용하여 업데이트 로직 수행
        if(updateData > 0){
            result.put("success","해당 배송지 삭제완료");
        }

        log.info("updateAddress----result:{}",result);
        return ResponseEntity.ok(result);
    }
    
}
