package com.example.team01.admin.service;

import com.example.team01.admin.dao.QnaProductDao;
import com.example.team01.vo.AdminBookVO;
import com.example.team01.vo.QnaProductVO;
import com.example.team01.utils.Pagination;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;
import java.util.List;

@Slf4j
@Service // 스프링의 서비스 계층 컴포넌트로 등록
public class QnaProductServiceImple implements QnaProductService {

    private final QnaProductDao qnaProductDao;
    
    // 생성자 주입 (권장)
    @Autowired
    public QnaProductServiceImple(QnaProductDao qnaProductDao) {
        this.qnaProductDao = qnaProductDao;
    }

    @Override
    public List<QnaProductVO> getAllQnaProductList(Pagination pagination) {
        log.info("컨트롤러에서 받아온 상품 문의 파라미터 pagination:{}", pagination.toString());

        //전체 데이터 레코드 행 조회해오기
        int total = qnaProductDao.totalRecord(pagination);
        log.info("서비스 total record-----------:{}", total);
        pagination.setTotalRecord(total);
        log.info("서비스 pagination 총 레코드 수 -----------:{}", pagination.getTotalRecord());
        log.info("서비스 pagination 총 getCurrentPage 수 -----------:{}", pagination.getCurrentPage());
        //startRow && endRow 설정
        pagination.setLimitRows(pagination.getCurrentPage());
        log.info("컨트롤러에서 받아온 파라미터 pagination2222:{}", pagination.toString());

        // 1:1 문의 데이터 전체 조회해오기
        List<QnaProductVO> qnaProList = qnaProductDao.getAllQnaProductList(pagination);
        log.info("페이지에 해당하는 데이터 리스트 -------:{}", qnaProList);

        // git 확인용 주석

        return qnaProList;
    }
}