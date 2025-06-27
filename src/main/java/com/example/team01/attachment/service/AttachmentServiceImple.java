package com.example.team01.attachment.service;

import org.springframework.stereotype.Service;
import com.example.team01.attachment.dao.AttachmentDao;
import com.example.team01.vo.AttachmentVO;
import com.example.team01.attachment.service.AttachmentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Service
public class AttachmentServiceImple implements AttachmentService {
    
    private final AttachmentDao attachmentDao;
    
    @Override
    public void insertAttachmentService(AttachmentVO vo) {
        log.info("InsertAttachmentService 호출");

        log.info("InsertAttachmentService 호출 후 최종 확인 vo: {}", vo);

        attachmentDao.InsertAttachment(vo);
    }
}