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

import java.util.HashMap;
import java.util.Map;

/**
 * 게시판 생성 관련 REST API 컨트롤러
 * 클라이언트에서 게시글 작성 요청을 처리합니다.
 */
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/board")
@RestController

public class CreateBoardController {
    
    private final CreateBoardService createBoardService;
    
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
                                             @RequestParam(value = "file", required = false) MultipartFile file) {
        
        log.info("=== 게시판 생성 요청 수신 ===");
        
        try {
            // 입력값 유효성 검증
            if (!StringUtils.hasText(category)) {
                log.warn("카테고리가 비어있습니다.");
                return createErrorResponse("카테고리는 필수 입력값입니다.", HttpStatus.BAD_REQUEST);
            }
            
            if (!StringUtils.hasText(title)) {
                log.warn("제목이 비어있습니다.");
                return createErrorResponse("제목은 필수 입력값입니다.", HttpStatus.BAD_REQUEST);
            }
            
            if (!StringUtils.hasText(content)) {
                log.warn("내용이 비어있습니다.");
                return createErrorResponse("내용은 필수 입력값입니다.", HttpStatus.BAD_REQUEST);
            }
            
            // 제목 길이 검증 (예: 최대 50자)
            if (title.length() > 50) {
                log.warn("제목이 너무 깁니다. 길이: {}", title.length());
                return createErrorResponse("제목은 50자 이내로 작성해주세요.", HttpStatus.BAD_REQUEST);
            }
            
            // 내용 길이 검증 (예: 최대 300자)
            if (content.length() > 300) {
                log.warn("내용이 너무 깁니다. 길이: {}", content.length());
                return createErrorResponse("내용은 300자 이내로 작성해주세요.", HttpStatus.BAD_REQUEST);
            }
            
            // 요청 정보 로깅
            log.info("카테고리: {}", category);
            log.info("제목: {} (길이: {}자)", title, title.length());
            log.info("내용 길이: {}자", content.length());
            
            // 파일 처리
            handleFileUpload(file);
            
            // 실제 게시글 저장 로직 실행
            createBoardService.createBoard(category, title, content, file);
            
            // 성공 응답 생성
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "게시글이 성공적으로 작성되었습니다.");
            response.put("data", createBoardData(category, title, content, file));
            
            log.info("게시글 작성 완료");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("게시글 작성 중 오류 발생: {}", e.getMessage(), e);
            return createErrorResponse("게시글 작성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.", 
                                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * 파일 업로드 처리 및 검증
     * 
     * @param file 업로드된 파일
     */
    private void handleFileUpload(MultipartFile file) {
        if (file != null && !file.isEmpty()) {
            try {
                String originalFilename = file.getOriginalFilename();
                long fileSize = file.getSize();
                String contentType = file.getContentType();
                
                log.info("첨부 파일 정보:");
                log.info("- 파일명: {}", originalFilename);
                log.info("- 파일 크기: {} bytes ({} KB)", fileSize, fileSize / 1024);
                log.info("- 파일 타입: {}", contentType);
                
                // 파일 크기 검증 (예: 10MB 제한)
                long maxFileSize = 10 * 1024 * 1024; // 10MB
                if (fileSize > maxFileSize) {
                    throw new IllegalArgumentException("파일 크기는 10MB를 초과할 수 없습니다.");
                }
                
                // 파일 확장자 검증
                if (originalFilename != null) {
                    String extension = getFileExtension(originalFilename);
                    if (!isAllowedFileType(extension)) {
                        throw new IllegalArgumentException("허용되지 않는 파일 형식입니다: " + extension);
                    }
                }
                
                // TODO: 실제 파일 저장 로직 구현
                // fileService.saveFile(file);
                
            } catch (Exception e) {
                log.error("파일 처리 중 오류 발생: {}", e.getMessage());
                throw new RuntimeException("파일 처리 중 오류가 발생했습니다.", e);
            }
        } else {
            log.info("첨부 파일 없음");
        }
    }
    
    /**
     * 파일 확장자 추출
     * 
     * @param filename 파일명
     * @return 확장자 (소문자)
     */
    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "";
        }
        return filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
    }
    
    /**
     * 허용된 파일 타입 검증
     * 
     * @param extension 파일 확장자
     * @return 허용 여부
     */
    private boolean isAllowedFileType(String extension) {
        String[] allowedTypes = {"jpg", "jpeg", "png", "gif", "pdf", "doc", "docx", "txt", "hwp"};
        for (String allowedType : allowedTypes) {
            if (allowedType.equals(extension)) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * 게시글 데이터 생성
     * 
     * @param category 카테고리
     * @param title 제목
     * @param content 내용
     * @param file 첨부파일
     * @return 게시글 정보 Map
     */
    private Map<String, Object> createBoardData(String category, String title, String content, MultipartFile file) {
        Map<String, Object> boardData = new HashMap<>();
        boardData.put("category", category);
        boardData.put("title", title);
        boardData.put("contentLength", content.length());
        boardData.put("hasFile", file != null && !file.isEmpty());
        if (file != null && !file.isEmpty()) {
            boardData.put("fileName", file.getOriginalFilename());
            boardData.put("fileSize", file.getSize());
        }
        return boardData;
    }
    
    /**
     * 오류 응답 생성
     * 
     * @param message 오류 메시지
     * @param status HTTP 상태 코드
     * @return ResponseEntity 오류 응답
     */
    private ResponseEntity<Map<String, Object>> createErrorResponse(String message, HttpStatus status) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("success", false);
        errorResponse.put("message", message);
        errorResponse.put("status", status.value());
        return ResponseEntity.status(status).body(errorResponse);
    }
}
