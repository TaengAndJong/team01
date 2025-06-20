package com.example.team01.client;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.team01.client.service.CreateBoardService;

/**
 * 게시판 생성 관련 REST API 컨트롤러
 * 클라이언트에서 게시글 작성 요청을 처리합니다.
 */
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/board")
@RestController

public class CreateBoardController {
    
    private final CreateBoardService createBoardService; // 의존성 주입
    
    /**
     * 게시글 생성 API
     * 
     * @param category 게시글 카테고리 (필수)
     * @param title 게시글 제목 (필수)
     * @param content 게시글 내용 (필수)
     * @param file 첨부 파일 (선택사항)
     * @return ResponseEntity 응답 결과
     */
    @PostMapping(value = "/createBoard")
    public ResponseEntity<?> postCreateBoard(
    @RequestParam("clientId")String clientId,    
    @RequestParam("clientName")String clientName,
    @RequestParam("category") String category,
    @RequestParam("title") String title,
    @RequestParam("content") String content,
    @RequestParam(value = "files", required = false) MultipartFile[] files) {

        log.info("clientId: {}", clientId);
        log.info("clientName: {}", clientName);
        log.info("category: {}", category);
        log.info("title: {}", title);
        log.info("content: {}", content);
        log.info("files: {}", files);
        
        // 단일 다중 파일 처리 로직
        if (files != null && files.length > 0) {
            if (files.length == 1 && !files[0].isEmpty()) {
                // ✅ 단일 파일 처리
                log.info("단일 파일: {}, 크기: {} bytes", files[0].getOriginalFilename(), files[0].getSize());
                // 단일 파일 게시물 등록 로직
            } else {
        // 다중 파일 처리 or 일부만 유효한 파일
        boolean hasValidFile = false;
        for (MultipartFile file : files) {
            if (!file.isEmpty()) {
                hasValidFile = true;
                log.info("다중 파일: {}, 크기: {} bytes", file.getOriginalFilename(), file.getSize());
                // 다중 파일 게시물 등록 로직
            }
        }
        if (!hasValidFile) {
            log.info("첨부된 파일이 모두 비어 있습니다.");
        }
    }
} else {
    log.info("파일이 첨부되지 않았습니다.");
}
        
        return ResponseEntity.ok("통신완료");
    }
}
