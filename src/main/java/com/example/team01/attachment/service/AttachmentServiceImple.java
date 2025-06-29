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
    public void insertAttachmentService(AttachmentVO attachmentVO) {
        log.info("InsertAttachmentService 호출");
        log.info("InsertAttachmentService 넘어온 VO : {}", attachmentVO);
        
        // // 파일 업로드 로직
        // try{
        //     if (files == null || files.isEmpty()) {
        //         throw new IllegalArgumentException("업로드된 파일이 없습니다.");
        //     }
        //     for (MultipartFile file : files) {
        //         String originFile = file.getOriginalFilename();
        //         log.info("업로드된 파일 이름: {}", originFile);
                
        //         // 필요한 경우 VO에 담아 DB에 저장
        //     }
        // }catch(Exception e){ 
        //     log.error("파일 업로드 실패: {}", e.getMessage());
        //     throw new RuntimeException("파일 업로드 실패");
        // }
    }
}