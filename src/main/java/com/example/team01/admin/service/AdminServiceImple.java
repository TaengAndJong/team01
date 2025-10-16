package com.example.team01.admin.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import com.example.team01.admin.dao.AdminDao;

@Slf4j
@RequiredArgsConstructor
@Service
public class AdminServiceImple implements AdminService {
    
    private final AdminDao dao ;

    @Override
    public int getQnaOneLength() {
        int result = dao.getQnaOneLength();
        return result;
    }

    @Override
    public int getProductLength() {
        int result = dao.getProductLength();
        return result;
    }

    @Override
    public int getDeliveryLength() {
        int result = dao.getDeliveryLength();
        return result;
    }

}
