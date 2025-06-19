package com.example.team01.client.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/**
 * 게시글 생성 서비스 구현체
 */
@Slf4j
@RequiredArgsConstructor
@Service
public class CreateBoardServiceImple implements CreateBoardService {

    @Override
    public void createBoard(String category, String title, String content, MultipartFile file) {
        log.info("=== 게시글 DB 저장 시작 ===");
        log.info("카테고리: {}", category);
        log.info("제목: {}", title);
        log.info("내용 길이: {}자", content.length());
        
        try {
            // TODO: 실제 DB 저장 로직 구현
            // 1. 게시글 정보를 VO에 담기
            // 2. DAO를 통해 DB에 저장
            // 3. 파일이 있다면 파일 저장 처리
            
            if (file != null && !file.isEmpty()) {
                log.info("첨부파일 저장: {}", file.getOriginalFilename());
                // TODO: 파일 저장 로직 구현
            }
            
            // 임시 로직: 데이터 저장 시뮬레이션
            Thread.sleep(100); // DB 저장 시간 시뮬레이션
            
            log.info("게시글 DB 저장 완료");
            
        } catch (Exception e) {
            log.error("게시글 저장 중 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("게시글 저장에 실패했습니다.", e);
        }
    }
} 