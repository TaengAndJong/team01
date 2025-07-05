package com.example.team01.deliveryboard.service;

import com.example.team01.vo.DeliveryBoardVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import com.example.team01.vo.AttachmentVO;
import com.example.team01.deliveryboard.dao.DeliveryBoardDao;
import com.example.team01.attachment.service.AttachmentService;

@Slf4j
@RequiredArgsConstructor
@Service
public class DeliveryBoardServiceImple implements DeliveryBoardService {


    private final DeliveryBoardDao DeliveryBoardDao;
    private final AttachmentService attachmentService;
    @Override
    public void CreateDeliveryBoard(DeliveryBoardVO vo) {
        log.info("서비스 임플 VO 객체 데이터: {}", vo);

        List<MultipartFile> files = vo.getFiles(); // 첨부파일 데이터 VO 객체에서 가져오기
        AttachmentVO attachmentVO = new AttachmentVO();

        log.info("[deliveryBoard 서비스 시작------------------------------------]");

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

                 // 1. 첨부파일 저장 후 UUID 리스트 받아오기 (한 번만 호출)
                List<String> savedFileNames = attachmentService.insertAttachmentService(attachmentVO);

                // 2. UUID 리스트를 쉼표로 연결한 문자열로 변환
                String joinedIds = String.join(",", savedFileNames);

                // 3. ProductBoardVO에 단일 문자열 형태로 설정
                vo.setAttachmentID(joinedIds);
            }

            log.info("file 업로드 후 deliveryBoardVO 객체 데이터: {}", vo);

            // DAO를 통한 게시물 등록
            DeliveryBoardDao.CreateDeliveryBoard(vo);
            log.info("게시물 등록 완료");

        } catch (Exception e) {
            log.error("게시물 등록 중 오류 발생", e); 
            throw new RuntimeException("게시물 등록 실패", e);
        }
    }
}
