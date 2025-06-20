package com.example.team01.client.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.Collections;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.example.team01.vo.CreateBoardVO;

/**
 * 게시글 생성 서비스 구현체
 */
@Slf4j
@RequiredArgsConstructor
@Service
public class CreateBoardServiceImple implements CreateBoardService {

    @Override
    public void createBoard(String category, String title, String content, String clientId, String name, MultipartFile file) {
        log.info("=== 게시글 DB 저장 시작 ===");
        log.info("카테고리: {}", category);
        log.info("제목: {}", title);
        log.info("내용 길이: {}자", content.length());
        log.info("사용자 ID: {}", clientId);
        log.info("사용자 이름: {}", name);
        log.info("첨부파일: {}", file.getOriginalFilename());

        try {
            // TODO: 실제 DB 저장 로직 구현
            // 1. 게시글 정보를 VO에 담기
            CreateBoardVO board = new CreateBoardVO();
            board.setTitle(title);
            board.setContent(content);
            board.setClientId(clientId);
            board.setName(name);
            board.setFiles(Collections.singletonList(file));
            
            log.info("VO에 담긴 데이터: {}", board);
        
            // 2. DAO를 통해 DB에 저장
            // 3. 파일이 있다면 파일 저장 처리
            // 4. 파일 저장 경로 반환
            

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