package com.example.team01.attachment.service;

import org.springframework.stereotype.Service;
import com.example.team01.attachment.dao.AttachmentDao;
import com.example.team01.vo.AttachmentVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import org.springframework.transaction.annotation.Transactional;
import com.example.team01.utils.FileUtils;
import java.util.ArrayList;
import java.time.LocalDateTime;

@Slf4j
@RequiredArgsConstructor
@Service
@Transactional
public class AttachmentServiceImple implements AttachmentService {
    
    private final AttachmentDao attachmentDao;
    private final FileUtils fileUtils;
    @Override
    public List<String> insertAttachmentService(AttachmentVO attachmentVO) {
        log.info("InsertAttachmentService 호출");
        log.info("InsertAttachmentService 넘어온 VO : {}", attachmentVO);
        List<MultipartFile> files = attachmentVO.getFiles();
        List<String> savedFileNames = new ArrayList<>();
        try {
            if (files == null || files.isEmpty()) {
                throw new IllegalArgumentException("업로드된 파일이 없습니다.");
            }

            for (MultipartFile file : files) {
                String originFile = file.getOriginalFilename();
                if (originFile == null) continue;
    
                log.info("업로드된 파일 이름: {}", originFile);

                // 1. 확장자 추출
                String fileType = "";
                int dotIndex = originFile.lastIndexOf(".");
                if (dotIndex != -1 && dotIndex < originFile.length() - 1) {
                    fileType = originFile.substring(dotIndex + 1).toLowerCase();

                // 2. 파일 저장 및 VO 구성
                String savedFileName = fileUtils.saveSingleMultiPartFile(file, attachmentVO.getCategory()); // ✅ 파일 저장 및 UUID 기반 이름 획득
                savedFileNames.add(savedFileName);
                if (savedFileName == null) {
                    throw new RuntimeException("파일 저장 실패");
                }

                // 3. 첨부파일 VO 구성
                AttachmentVO fileVO = new AttachmentVO(); // 첨부파일 VO 생성
                fileVO.setAttachmentID(savedFileName);
                fileVO.setFileName(originFile);
                fileVO.setFileType(fileType);
                fileVO.setFileSize(file.getSize());
                fileVO.setFileData(file.getBytes()); // 파일 데이터 저장
                fileVO.setUploader(attachmentVO.getUploader()); // 클라이언트 ID
                fileVO.setBoardType(attachmentVO.getCategory()); // 게시판 분류 (카테고리)
                attachmentVO.setSavedFileName(savedFileName);
                log.info("fileVO DAO 호출 전: {}", fileVO);
                // DAO 호출
                attachmentDao.InsertAttachment_ID(fileVO);
                }
            }
        }catch(Exception e){ 
            log.error("파일 업로드 실패: {}", e.getMessage());
            throw new RuntimeException("파일 업로드 실패");
        }
        return savedFileNames;
    }

    // 특정 게시물 첨부파일 조회 후 반환
    public List<AttachmentVO> GetAttachmentList(String userId , String boardType, LocalDateTime boardDate) {
        log.info("GetAttachmentList 호출");
        log.info("GetAttachmentList 넘어온 userId, boardType, boardDate: {}, {}, {}", userId, boardType, boardDate);
        List<AttachmentVO> attachmentList = attachmentDao.GetAttachmentList(userId , boardType , boardDate);
        log.info("첨부파일 조회 결과: {}", attachmentList);
        return attachmentList;
    }
}