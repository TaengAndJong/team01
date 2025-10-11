package com.example.team01.mypage.userInfo.service;


import com.example.team01.mypage.userInfo.dao.UserInfoDao;
import com.example.team01.mypage.userInfo.dto.PasswordDTO;
import com.example.team01.mypage.userInfo.dto.UserInfoDTO;
import com.example.team01.vo.ClientVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@RequiredArgsConstructor
@Transactional //스프링이 트랜잭션관리
@Service // 서비스 빈 선언
public class UserInfoServiceImple implements UserInfoService {

    private final UserInfoDao dao;
    private final PasswordEncoder passwordEncoder;
    @Override
    public UserInfoDTO selectClientInfo(String clientId, String roleId) {
        log.info("user ClientId : {}, role :{}",clientId,roleId);
        ClientVO userInfoVO = dao.selectClientInfo(clientId, roleId) ;

        if (userInfoVO == null) {
            throw new RuntimeException("해당 사용자가 존재하지 않습니다. clientId=" + clientId);
        }

        return voToDTO(userInfoVO);

    } // 서비스 인터페이스 구현

    @Override
    public int upatePassword(String clientId,String newPassword) {

        log.info("new password -------- 새로바꿀 비밀번호: {}",newPassword);
        // 새로운 비밀번호 시큐리티를 통해 암호화하기
        String password= passwordEncoder.encode(newPassword);
        log.info("user password ---- updatePassword: {}",password);

        return dao.updatePassword(clientId, password);
    }

    @Override
    public int updateAllUserInfo(UserInfoDTO userInfoDTO) {
        log.info(" 비번 제외 새로 바뀐 정보들: {}",userInfoDTO);

        return dao.updateAllUserInfo(userInfoDTO);
    }

    //새로운 비밀번호로 변경


    public UserInfoDTO voToDTO(ClientVO vo) {
        log.info("UserInfoDTO Vo --- :{}", vo);

        UserInfoDTO dto = UserInfoDTO.builder()
                .clientId(vo.getClientId())
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
