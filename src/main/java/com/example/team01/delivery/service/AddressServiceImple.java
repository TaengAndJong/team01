package com.example.team01.delivery.service;

import com.example.team01.delivery.dao.AddressDao;
import com.example.team01.vo.AddressVO;
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

}
