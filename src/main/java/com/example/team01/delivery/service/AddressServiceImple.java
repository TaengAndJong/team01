package com.example.team01.delivery.service;

import com.example.team01.common.exception.BusinessException;
import com.example.team01.delivery.dao.AddressDao;
import com.example.team01.dto.address.AddressDTO;
import com.example.team01.vo.AddressVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
public class AddressServiceImple implements AddressService{

    private final AddressDao dao;

    @Override
    public List<AddressDTO> selectAddress(String clientId) {
        //vo객체를 이용해 db 데이터 조회해오기
        List<AddressVO> addressList = dao.selectAddress(clientId);
        log.info("result---:{}", addressList);
        //VO를 DTO로 변환하기
        List<AddressDTO> addressDTOList = addressList.stream()
                        .map(this::convertToDTO)
                                .collect(Collectors.toList());
        //데이터베이스의 행들을 조회해온 addressList를 streamAPI로 순회하여 
        //Map함수를 통해 각 행에 convertToDTO 메서드를 실행해 vo에서 DTO로 변환 후
        // collect를 사용하여 list로 반환
        log.info("addressDTOList:{}",addressDTOList);
        return addressDTOList;
    }


    @Override
    public AddressDTO selectOneAddress(String clientId) {
        log.info("payment-------selectOneAddress:{}",clientId);
        AddressVO vo = dao.selectOneAddress(clientId);
        //AddressVO 사용하기
        log.info("payment-------addressVO 조회:{}",vo.getAddrId());
        log.info("payment-------addrId:{}",vo.getAddrId());

        AddressDTO addrDto = AddressDTO.builder()
                .addrId(vo.getAddrId())
                .addr(vo.getAddr())
                .addrType(vo.getAddrType())
                .detailAddr(vo.getDetailAddr())
                .zoneCode(vo.getZoneCode())
                .clientId(vo.getClient().getClientId())
                .build();

        log.info("paymentVO-------addrDto:{}",addrDto);

        return addrDto;
    }

    @Override
    public int insertAddress(AddressVO addressVO) {
        log.info("insertAddress-------------------:{}",addressVO);
        // 해당유저의 기본주소가 isdefault 'Y' 있는지 조회 :
        //필요파라미터 : 해당유저 ==> clientId
        String clientId = addressVO.getClient().getClientId();
        log.info("insertAddress-----------clientId:{}",clientId);
        //clientId를 파라미터로 한 isdefault 'Y' 레코드 조회
        int isDefaultAddr =dao.isDefaultStatus(clientId);
        log.info("insertAddress-----------isDefaultAddr:{}",isDefaultAddr);

        if(isDefaultAddr == 0){
            // 없으면 isdefault 'Y'로 설정
            addressVO.setIsdefault("Y");
            //있으면 isdefault 'N'으로 설정
        }else{
            addressVO.setIsdefault("N");
        }

        // address insert 실행
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
    public int deleteAddress(String clientId,Long addrId) {
        int cnt = dao.deleteAddress(addrId,clientId);
        return cnt;
    }

// 장바구니 재송지 변경 모달에서 사용하는 주소조회
    @Override
    public AddressDTO selectCartAddress(String clientId) {
        log.info("장바구니 주소 ------ 서비스 구현체 진입");
        List<AddressVO> usesrAddrList = dao.selectCartAddress(clientId);
        log.info("selectCartAddress--------usesrAddrList:{}",usesrAddrList);
        
        // VO 에서 DTO로 변경
        // List 객체에서 stream() API를 통해 첫번째요소를 찾고 값이 없으면 null 반환
        AddressDTO addressDTO = usesrAddrList.stream()
                .map(this::convertToDTO).collect(Collectors.toList()).stream().findFirst().orElse(null);
        log.info("selectCartAddress------addressDTO:{}",addressDTO);
        return addressDTO;
    }

    @Override
    public int updateCartAddress(String clientId, Long addrId) {
        log.info("장바구니 주소 ------ 변경 구현체 진입");
        log.info("장바구니 주소 ------ clientId:{},addrId:{}",clientId,addrId);

        //해당유저의 선택되어 넘어온 addrId에 해당하는 주소 isdefault 값 Y 로 변경, 기존 주소는 N으로 변경
        //client의 isdefault 전부 N 으로 갱신
        dao.clearDefaultStatus(clientId);
        // 선택된 addrId의 isdefault 를 Y로 갱신
        int changeAddress = dao.updateChangeCartAddress(clientId,addrId);
        log.info("장바구니 기본주소 선택변경",changeAddress);
        // addrId  또는 clientId가 존재하지 않으면  0 , 예외처리
        if(changeAddress == 0){
            throw new BusinessException("배송지 변경을 실패했습니다.");
        }
        return changeAddress;
    }




    //adderssVO ==> addressDTO
    private AddressDTO convertToDTO(AddressVO vo) {

        log.info("AddressVO---------convertToDTO:{}",vo);

        // vo를 파라미터로 받아 DTO 값 설정해주기 :
        AddressDTO addressDTO = AddressDTO.builder()
                .addrId(vo.getAddrId())
                .clientId(vo.getClient().getClientId())
                .addrType(vo.getAddrType())
                .addr(vo.getAddr())
                .zoneCode(vo.getZoneCode())
                .detailAddr(vo.getDetailAddr())
                .isdefault(vo.getIsdefault())
                .build();

        return  addressDTO;
    }

}
