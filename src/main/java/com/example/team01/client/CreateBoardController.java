package com.example.team01.client;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import java.util.Collections;
// 의존성 
import com.example.team01.client.service.CreateBoardService;
import com.example.team01.vo.CreateBoardVO;

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
     * @param clientId 사용자 ID (필수)
     * @param clientName 사용자 이름 (필수)
     * @param category 게시글 카테고리 (필수)
     * @param title 게시글 제목 (필수)
     * @param content 게시글 내용 (필수)
     * @param files 첨부 파일 (선택사항)
     * @return ResponseEntity 응답 결과
     */
    @PostMapping(value = "/createBoard")
    public ResponseEntity<?> postCreateBoard(
            @ModelAttribute CreateBoardVO createBoardVO,
            @RequestParam(name = "clientId") String clientId,    
            @RequestParam(name = "clientName") String clientName,
            @RequestParam(name = "category") String category,
            @RequestParam(name = "title") String title,
            @RequestParam(name ="content") String content,
            @RequestParam(name = "files", required = false) List<MultipartFile> files) {
        

        log.info("게시글 생성 시작");
        
        CreateBoardVO createBoardVO = new CreateBoardVO(); // 객체 직접 생성

        // 🟡 Null 체크 여기서 반드시 먼저 수행
        if (files != null) {
            for (MultipartFile file : files) {
                log.info("files 타입: {}", file.getClass().getName());
            }
            createBoardVO.setFiles(files);
        } else {
            log.info("첨부된 파일이 없습니다 (files == null)");
            createBoardVO.setFiles(Collections.emptyList());
            createBoardVO.setFileName("첨부파일 없음");
            log.info("createBoardVO: {}", createBoardVO);
        }

        createBoardVO.setClientId(clientId);
        createBoardVO.setClientName(clientName);
        createBoardVO.setCategory(category);
        createBoardVO.setTitle(title);
        createBoardVO.setContent(content);
<<<<<<< HEAD
        createBoardVO.setFiles(files);

        log.info("VO 객체 데이터: {}", createBoardVO);
=======

        log.info("컨트롤러 VO 객체 데이터: {}", createBoardVO);
>>>>>>> pj-bod

        try {
            // 게시물 등록 service 호출
            createBoardService.createBoard(createBoardVO);
            log.info("게시물 등록 완료");
            return ResponseEntity.ok("게시물 등록 완료");
        } catch (Exception e) {
            log.error("게시물 등록 실패: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("게시물 등록 실패: " + e.getMessage());
        }
    }
}


// // 단일 다중 파일 처리 로직
// if (files != null && files.length > 0) {
//     if (files.length == 1 && !files[0].isEmpty()) {
//         // ✅ 단일 파일 처리
//         log.info("단일 파일: {}, 크기: {} bytes", files[0].getOriginalFilename(), files[0].getSize());
//         // 단일 파일 게시물 등록 로직
//     } else {
// // 다중 파일 처리 or 일부만 유효한 파일
// boolean hasValidFile = false;
// for (MultipartFile file : files) {
//     if (!file.isEmpty()) {
//         hasValidFile = true;
//         log.info("다중 파일: {}, 크기: {} bytes", file.getOriginalFilename(), file.getSize());
//         // 다중 파일 게시물 등록 로직
        
//     }
// }
// if (!hasValidFile) {
//     log.info("첨부된 파일이 모두 비어 있습니다.");
// }
// }
// } else {
// log.info("파일이 첨부되지 않았습니다.");
// }