package com.example.team01.common.service;

import com.example.team01.common.dao.ClientDao;
import com.example.team01.vo.ClientVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ClientServiceImple implements ClientService {

    private final ClientDao dao;

    @Override
    public ClientVO getClientWithRole(String clientId) {
        return dao.getClientWithRole(clientId);
    }

}
