package com.example.team01.attachment.service;

import org.springframework.stereotype.Service;
import com.example.team01.attachment.dao.AttachmentDao;
import com.example.team01.vo.AttachmentVO;
import com.example.team01.attachment.service.AttachmentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@RequiredArgsConstructor
@Service
@Transactional
public class AttachmentServiceImple implements AttachmentService {
    
    private final AttachmentDao attachmentDao;
    
    @Override
    public void insertAttachmentService(List<MultipartFile> files) {
        log.info("InsertAttachmentService 호출");
        log.info("InsertAttachmentService 호출 후 files: {}", files);
        
        try{

        }catch(Exception e){ 
            log.error("파일 업로드 실패: {}", e.getMessage());
            throw new RuntimeException("파일 업로드 실패");
        }
        if (files == null || files.isEmpty()) {
            throw new IllegalArgumentException("업로드된 파일이 없습니다.");
        }
        for (MultipartFile file : files) {
            String originFile = file.getOriginalFilename();
            log.info("업로드된 파일 이름: {}", originFile);
            
            // 필요한 경우 VO에 담아 DB에 저장
        }
        // 첨부파일 저장 로직
        // 파일이 1개일 경우
        if (files.size() == 1) {
            log.info("파일이 1개일 경우");
            AttachmentVO vo = new AttachmentVO(); // 첨부파일 정보 저장 객체 설정
            vo.setFileName(files.get(0).getOriginalFilename());
            vo.setFileType(files.get(0).getContentType()); // 확장자
            vo.setFileSize(files.get(0).getSize());
            vo.setUploader(files.get(0).getOriginalFilename());
        }
        // 파일이 2개 이상일 경우
        else if (files.size() > 1) {
            log.info("파일이 2개 이상일 경우");
            for (MultipartFile file : files) {

        }
        // 파일이 없을 경우 예외처리

        // attachmentDao.InsertAttachment(vo);
        }
    }
}