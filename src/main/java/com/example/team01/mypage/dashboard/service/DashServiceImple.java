package com.example.team01.mypage.dashboard.service;

import com.example.team01.mypage.dashboard.dao.DashDao  ;
import com.example.team01.mypage.dashboard.dto.ResponseQnaCntDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@RequiredArgsConstructor
@Transactional
@Service
public class DashServiceImple implements DashService {

    private final DashDao dao;

    @Override
    public ResponseQnaCntDTO selectBoardCnt(String clientId) {
        log.info("selectBoardCnt:{}", dao.selectBoardCnt(clientId));
        return dao.selectBoardCnt(clientId);
    }
}
