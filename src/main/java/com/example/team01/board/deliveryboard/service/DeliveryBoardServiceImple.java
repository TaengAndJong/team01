package com.example.team01.board.deliveryboard.service;

import com.example.team01.vo.DeliveryBoardVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import com.example.team01.vo.AttachmentVO;
import com.example.team01.attachment.service.AttachmentService;
import com.example.team01.board.deliveryboard.dao.DeliveryBoardDao;


@Slf4j
@RequiredArgsConstructor
@Service
public class DeliveryBoardServiceImple implements DeliveryBoardService {

    private final DeliveryBoardDao DeliveryBoardDao;
    private final AttachmentService attachmentService;
    // 게시물 등록
    @Override
    public int CreateDeliveryBoard(DeliveryBoardVO vo) {
        log.info("서비스 임플 VO 객체 데이터: {}", vo);

        List<MultipartFile> files = vo.getFiles(); // 첨부파일 데이터 VO 객체에서 가져오기
        AttachmentVO attachmentVO = new AttachmentVO();

        log.info("[deliveryBoard 서비스 시작------------------------------------]");
        log.info("files --------:{}", files);

        try {
            // 조건: files가 null 또는 비어있을 경우
            if (files == null || files.isEmpty()) {
                log.info("파일이 첨부되지 않은 업로드 시작------------------:");
            }
            // 조건: 파일 사이즈가 1 이상일 경우
            else if (files.size() >= 1) {
                log.info("한개 이상 파일 업로드 시작");
                attachmentVO.setCategory(vo.getCategory());
                attachmentVO.setFiles(vo.getFiles());
                attachmentVO.setUploader(vo.getClientId());
                attachmentService.insertAttachmentService(attachmentVO);// 파일첨부 테이블 등록
            }

            log.info("file 업로드 후 deliveryBoardVO 객체 데이터: {}", vo);
            
            // DAO를 통한 게시물 등록
            int result = DeliveryBoardDao.CreateDeliveryBoard(vo);
            log.info("게시물 등록 완료, 반환값: {}", result);

            return result; // ✅ 반드시 반환
        } catch (Exception e) {
            log.error("게시물 등록 중 오류 발생", e); 
            throw new RuntimeException("게시물 등록 실패", e);
        }

    }

    @Override
    public List<DeliveryBoardVO> GetDelivBoardlist(String userId) {
        log.info("serviceimple 배송문의 리스트 조회 시작 ------------------------");
        log.info("사용자 ID: " + userId);
        List<DeliveryBoardVO> list = DeliveryBoardDao.GetDelivBoardlist(userId); // DAO 호출 사용자 아이디 전달
        log.info("serviceimple 배송문의 리스트 조회 완료 ------------------------");
        log.info("list: {}", list);
        return list;
    }

    @Override
    public DeliveryBoardVO getDeliveryBoardDetail(String boardId, String userId) {
        log.info("1:1 문의 상세 조회 서비스 구현체 실행: {}, {}", boardId, userId);

        DeliveryBoardVO boardData = DeliveryBoardDao.getDeliveryBoardDetail(boardId, userId);
        log.info("상세조회 결과: {}", boardData);
        
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

    // 사용자 배송 문의 게시물 삭제
    @Override
    public int deleteDeliveryBoard(String boardId) {
        log.info("1:1 문의 게시물 삭제 서비스 구현체 실행");
        log.info("boardId:{}", boardId);
        return DeliveryBoardDao.deleteDeliveryBoard(boardId);
    }

}
