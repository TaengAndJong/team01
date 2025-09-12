package com.example.team01.admin.service;

import com.example.team01.admin.dao.QnaDeliveryDao;
import com.example.team01.vo.AdminBookVO;
import com.example.team01.vo.QnaDeliveryVO;
import com.example.team01.utils.Pagination;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import com.example.team01.attachment.service.AttachmentService;
import com.example.team01.vo.AttachmentVO;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

@Slf4j
@Service // 스프링의 서비스 계층 컴포넌트로 등록
@RequiredArgsConstructor // 생성자 자동 주입
public class QnaDeliveryServiceImple implements QnaDeliveryService {

    private final QnaDeliveryDao qnaDeliveryDao;
    private final AttachmentService attachmentService;

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

        return qnaDelivList;
    }

    // 배송 문의 상세 조회
    @Override
    public QnaDeliveryVO getQnaDeliveryDetail(String boardId, String userId) {
        log.info("배송 문의 상세 조회 서비스 구현체 실행");
        log.info("boardId:{}", boardId);
        log.info("userId:{}", userId);
        // 1. 게시물 데이터를 가져오기
    QnaDeliveryVO boardData = qnaDeliveryDao.getDeliveryDetailBoard(boardId, userId);

    // 1단계: null 체크
    if (boardData == null) {
        throw new IllegalArgumentException("게시물을 찾을 수 없습니다.");
    }

    // 2단계: 삭제 여부 체크
    if ("Y".equals(boardData.getQnaDel())) {
        throw new IllegalArgumentException("삭제된 게시물입니다.");
    }
    
    log.info("상품 상세조회 서비스 구현체 실행 결과:{}", boardData);

    // 2. attachment qnaDate, userId, category, 첨부파일 데이터 조회
    log.info("첨부파일 조회 시작");
    List<AttachmentVO> attachmentList = attachmentService.GetAttachmentList(userId, "delivery", boardData.getQnaDate());
    log.info("첨부파일 조회 결과:{}", attachmentList);
    boardData.setAttachmentList(attachmentList);
    
    // 4. 반환 받은 데이터 넘기기
    log.info("상품 상세조회 서비스 구현체 실행 결과:{}", boardData);
    return boardData;
    }

    // 배송 문의 게시물 삭제
    @Override
    public int deleteDeliveryBoard(String boardId) {
        log.info("배송 문의 게시물 삭제 서비스 구현체 실행");
        log.info("boardId:{}", boardId);
        return qnaDeliveryDao.deleteDeliveryBoard(boardId);
    }
}