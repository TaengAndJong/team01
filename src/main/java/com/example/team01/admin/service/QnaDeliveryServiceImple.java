package com.example.team01.admin.service;

import com.example.team01.admin.dao.QnaDeliveryDao;
import com.example.team01.vo.AdminBookVO;
import com.example.team01.vo.QnaDeliveryVO;
import com.example.team01.utils.Pagination;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

@Slf4j
@Service // 스프링의 서비스 계층 컴포넌트로 등록
public class QnaDeliveryServiceImple implements QnaDeliveryService {

    private final QnaDeliveryDao qnaDeliveryDao;

    @Autowired
    public QnaDeliveryServiceImple(QnaDeliveryDao qnaDeliveryDao) {
        this.qnaDeliveryDao = qnaDeliveryDao;
    }
    
    @Override
    public List<QnaDeliveryVO> getAllQnaDeliveryList(Pagination pagination) {
        log.info("컨트롤러에서 받아온 배송 문의 파라미터 pagination:{}", pagination.toString());

        //전체 데이터 레코드 행 조회해오기
        int total = qnaDeliveryDao.totalRecord(pagination);
        log.info("서비스 total record-----------:{}", total);
        pagination.setTotalRecord(total);
        log.info("서비스 pagination 총 레코드 수 -----------:{}", pagination.getTotalRecord());
        log.info("서비스 pagination 총 getCurrentPage 수 -----------:{}", pagination.getCurrentPage());
        //startRow && endRow 설정
        pagination.setLimitRows(pagination.getCurrentPage());
        log.info("컨트롤러에서 받아온 파라미터 pagination2222:{}", pagination.toString());

        // 1:1 문의 데이터 전체 조회해오기
        List<QnaDeliveryVO> qnaDelivList = qnaDeliveryDao.getAllQnaDeliveryList(pagination);
        log.info("페이지에 해당하는 데이터 리스트 -------:{}", qnaDelivList);

        // git 확인용 주석

        return qnaDelivList;
    }
}