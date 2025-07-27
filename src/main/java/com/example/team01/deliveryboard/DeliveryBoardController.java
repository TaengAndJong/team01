package com.example.team01.deliveryboard;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.Collections;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;


// 의존성 
import com.example.team01.deliveryboard.service.DeliveryBoardService;
import com.example.team01.vo.DeliveryBoardVO;

/**
 * 게시판 생성 관련 REST API 컨트롤러
 * 클라이언트에서 게시글 작성 요청을 처리합니다.
 */
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/board")
@RestController
public class DeliveryBoardController {

    private final DeliveryBoardService deliveryBoardService;

    @PostMapping(value = "/deliveryBoard")
    public ResponseEntity<?> CreateDelivBoard(
            @RequestParam("clientId") String clientId,    
            @RequestParam("clientName") String clientName,
            @RequestParam("category") String category,
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam(value = "files", required = false) List<MultipartFile> files) {
                
            log.info("컨트롤러 배달 문의 게시물 등록 통신 시작");
            DeliveryBoardVO vo = new DeliveryBoardVO(); // 배달 문의 VO 객체 생성

        // 🟡 Null 체크 여기서 반드시 먼저 수행
        if (files != null && !files.isEmpty()) {
            for (MultipartFile file : files) {
                log.info("files 타입: {}", file.getClass().getName());
                vo.setFiles(files);
            }
        } else {
            log.info("첨부된 파일이 없습니다 (files == null 또는 empty)");
            vo.setFiles(Collections.emptyList());
        }

        // 3) 나머지 필드 세팅
        vo.setClientId(clientId);
        vo.setClientName(clientName);
        vo.setCategory(category);
        vo.setTitle(title);
        vo.setContent(content);

            log.info("최종 확인 컨트롤러 배달 문의 VO: {}", vo);
            try {
                // 게시물 등록 service 호출
                deliveryBoardService.CreateDeliveryBoard(vo);
                log.info("게시물 등록 완료");
                return ResponseEntity.ok("게시물 등록 완료");
            } catch (Exception e) {
                log.error("게시물 등록 실패: {}", e.getMessage());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("게시물 등록 실패: " + e.getMessage());
            }
        }
    
    @GetMapping("/readBoard/{category}/{id}")
    public ResponseEntity<?> GetDelivBoard(@PathVariable("category") String category, @PathVariable("id") String id)
    {
        log.info("컨트롤러 배달 문의 게시물 조회 통신 시작");
        log.info("카테고리: " + category + ", 아이디: " + id);
        return ResponseEntity.ok(" 통신 성공! 받은 ID: " + id + ", 받은 카테고리: " + category);
    }

    @GetMapping("/DelivBoardlist")
    public ResponseEntity<?> GetDelivBoardlist(@RequestParam String userId)
    {
        log.info("게시물 리스트 조회 시작");
        log.info("사용자 ID: " + userId);
        List<DeliveryBoardVO> list = deliveryBoardService.GetDelivBoardlist(userId);
        return ResponseEntity.ok("통신완료" + userId); // 리스트 반환
    }
}