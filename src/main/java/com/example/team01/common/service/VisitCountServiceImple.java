package com.example.team01.common.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import com.example.team01.common.dao.VisitCountDao;
import com.example.team01.dto.common.VisitRequestDTO;

import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

@Slf4j
@Service // 스프링의 서비스 계층 컴포넌트로 등록
@RequiredArgsConstructor // 생성자 자동 주입
@Transactional
public class VisitCountServiceImple implements VisitCountService {
    private final VisitCountDao visitCountDao;
    @Override
    public int insertVisitLog(VisitRequestDTO dto){
        log.info("dto_info : {}", dto);
        int result = visitCountDao.insertVisitLog(dto);
        
        int result2 = visitCountDao.insertDailyPageView(dto);
        log.info("차트result2:{}",result2);
        return result;
    }
}
