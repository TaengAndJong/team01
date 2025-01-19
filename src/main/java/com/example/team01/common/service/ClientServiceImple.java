package com.example.team01.common.service;

import com.example.team01.common.dao.ClientDao;
import com.example.team01.vo.ClientVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ClientServiceImple implements ClientService {

    private final ClientDao dao;

    @Override
    public ClientVO getClientWithRole(String clientId) {
        return dao.getClientWithRole(clientId);
    }


    @Override
    public ClientVO selectOneStaff(String staffId, String staffName,String staffBirth) {
        // cnt 인트 타입으로 반환해야함??
        return dao.selectOneStaff(staffId, staffName, staffBirth);
    }

    @Override
    public int selectDuplicateClientStaff(String staffId, String staffName, String staffBirth) {

        int cnt;
        if (staffId != null && staffName != null && staffBirth != null) {  // null 체크를 올바르게 수정
            log.info("insert user data:{}", staffId);
            log.info("insert user dao----------:{}", dao.selectDuplicateClientStaff(staffId, staffName, staffBirth));
            return cnt = dao.selectDuplicateClientStaff(staffId, staffName, staffBirth);  // 중복 확인 결과 반환
        }
        return 0;

    }


}
