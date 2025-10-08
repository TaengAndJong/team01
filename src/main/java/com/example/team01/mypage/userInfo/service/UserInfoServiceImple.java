package com.example.team01.mypage.userInfo.service;


import com.example.team01.mypage.userInfo.dao.UserInfoDao;
import com.example.team01.mypage.userInfo.dto.UserInfoDTO;
import com.example.team01.vo.ClientVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@RequiredArgsConstructor
@Transactional //스프링이 트랜잭션관리
@Service // 서비스 빈 선언
public class UserInfoServiceImple implements UserInfoService {

    private final UserInfoDao dao;

    @Override
    public UserInfoDTO selectClientInfo(String clientId, String roleId) {
        log.info("user ClientId : {}, role :{}",clientId,roleId);
        ClientVO userInfoVO = dao.selectClientInfo(clientId, roleId) ;

        if (userInfoVO == null) {
            throw new RuntimeException("해당 사용자가 존재하지 않습니다. clientId=" + clientId);
        }

        return voToDTO(userInfoVO);

    } // 서비스 인터페이스 구현


    public UserInfoDTO voToDTO(ClientVO vo) {
        log.info("UserInfoDTO Vo --- :{}", vo);

        UserInfoDTO dto = UserInfoDTO.builder()
                .clientId(vo.getClientId())
                .password(vo.getPassword())
                .roleId(vo.getRoleId())
                .clientName(vo.getClientName())
                .birth(vo.getBirth())
                .tel(vo.getTel())
                .addr(vo.getAddr())
                .detailAddr(vo.getDetailAddr())
                .zoneCode(vo.getZoneCode())
                .selecedAddrId(vo.getSelecedAddrId())
                .email(vo.getEmail())
                .joinDate(vo.getJoinDate())
                .status(vo.getStatus())
                .withDrowDate(vo.getWithDrowDate())
                .build();


        log.info("dto ----------사요자 정보 디티오:{}",dto);
        return dto;
    }



}
