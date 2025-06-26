package com.example.team01.delivery.service;

import com.example.team01.delivery.dao.AddressDao;
import com.example.team01.vo.AddressVO;
import com.example.team01.vo.CartVO;
import com.example.team01.vo.DeliveryVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class AddressServiceImple implements AddressService{

    private final  AddressDao dao;

    @Override
    public List<AddressVO> selectAddress(String clientId) {
        List<AddressVO> result = dao.selectAddress(clientId);
        log.info("result---:{}", result);

//        if (result == null) {
//            log.info("selectAddress null------------:{}", result);
//            result = Collections.emptyList(); // null 방지 ==> "비어 있는 리스트"를 리턴
//        }

        log.info("selectAddress:{}",result);
        return result;
    }

    @Override
    public int insertAddress(AddressVO addressVO) {
        log.info("insertAddress:{}",addressVO);
        int cnt = dao.insertAddress(addressVO);
        return cnt;
    }

    @Override
    public int updateAddress(AddressVO addressVO) {
        int cnt=0;
        log.info("updateAddress---vo:{}",addressVO);
        try {
            cnt =dao.updateAddress(addressVO);
            log.info("updateAddress--cnt:{}",cnt);
        } catch (Exception e) {
            e.printStackTrace(); // 로그가 안 뜨는 예외까지 확인 가능
        }



        return cnt;
    }

    @Override
    public int deleteAddress(String clientId,String addrId) {
        int cnt = dao.deleteAddress(addrId,clientId);
        return cnt;
    }

    @Override
    public AddressVO selectCartAddress(String clientId) {
        log.info("장바구니 주소 ------ 서비스 구현체 진입");
        List<AddressVO> usesrAddrList = dao.selectCartAddress(clientId);
        log.info("selectCartAddress--------usesrAddrList:{}",usesrAddrList);
        //List 객체에서 stream() API를 통해 첫번째요소를 찾고 값이 없으면 null 반환
        AddressVO result = usesrAddrList.stream().findFirst().orElse(null);
        log.info("selectCartAddress------result:{}",result);
        return result;
    }

    @Override
    public int updateCartAddress(String clientId, String addrId) {
        log.info("장바구니 주소 ------ 변경 구현체 진입");
        log.info("장바구니 주소 ------ clientId:{},addrId:{}",clientId,addrId);

        int cnt = dao.updateCartAddress(clientId,addrId);

        return cnt;
    }

}
