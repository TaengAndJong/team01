package com.example.team01.admin;

import com.example.team01.admin.service.QnaProductService;
import com.example.team01.comments.service.CommentsService;
import com.example.team01.utils.Pagination;
import com.example.team01.vo.CommentsVO;
import com.example.team01.vo.QnaProductVO;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/admin/board")
public class QnaProductController {
    private final CommentsService commentsService;
    private final QnaProductService qnaProductService;
    
    @GetMapping("/qnaProductList")
    public ResponseEntity<?> getQnaProductList(@RequestParam(defaultValue = "1") int currentPage, @RequestParam(defaultValue = "6") int pageSize, HttpServletRequest request) {
        log.info("currentPage = {}, pageSize = {} " , currentPage, pageSize);
        //확인 완료

        log.info("상품 문의 API 호출됨 이거");
        //페이지 계산 클래스 불러오기

        // 클래스    참조변수  인스턴스생성  생성자호출 (매개 변수 , 매개 변수)
        Pagination pagination = new Pagination(currentPage, pageSize); //현재페이지 && 보여줄 페이지 수

        //서비스로 데이터 넘기기
        List<QnaProductVO> qnaProductList = qnaProductService.getAllQnaProductList(pagination);
        log.info("qnaProductList size------------ = {}", qnaProductList.size());

        Map<String, Object> result = new HashMap<>();
        result.put("items", qnaProductList);
        result.put("currentPage", pagination.getCurrentPage());
        result.put("pageSize", pagination.getPageSize());
        result.put("totalPages", pagination.getTotalPages());
        result.put("totalRecord", pagination.getTotalRecord());
        log.info("result---get:{}", result);
        // 배열 안에 객체 형태로 내보내려면 원본 Map 사용하지 않고 내보내야함
        return ResponseEntity.ok(result);
    }

    @PostMapping(value = "/qnaProductList")
    public ResponseEntity<?> getSearchQnaProductList(
            @RequestParam(required = false) String searchType,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "6") int pageSize,
            HttpServletRequest request) {
        log.info("도서 목록 상품 문의 searchkeyword API 호출됨");
        log.info("상품 문의 searchType -------------------: {}", searchType);
        log.info("상품 문의 keyword -----------------: {}", keyword);

        //페이지 계산 클래스 불러오기
        Pagination pagination = new Pagination(page, pageSize);
        log.info("상품 문의 pagination -----------------: {}", pagination);

        //검색필터 설정해주기
        pagination.addDetailCondition("searchType", searchType);
        pagination.addDetailCondition("keyword", keyword);

        log.info("상품 문의 DetailContion-----:{}", pagination.getDetailCondition());

        //서비스로 검색 파라미터 넘겨줘서 찾기  
        List<QnaProductVO> qnaProductList = qnaProductService.getAllQnaProductList(pagination);

        log.info("검색된 상품문의 목록: {}", qnaProductList);
        // 레코드 순회
        for (QnaProductVO qnaProductVO : qnaProductList) {
            log.info("여기--검색 책목록:{}", qnaProductVO);
//                fileUtils.changeImgPath(qnaProductVO,request); // 새로운 이미지주소를 가진  bookVO객체가 반환됨
            log.info("다음--검색 책목록:{}", qnaProductVO);
        }
        
        // ✅ 페이지네이션 정보도 함께 반환하도록 수정
        Map<String, Object> result = new HashMap<>();
        result.put("items", qnaProductList);                    // 실제 데이터
        result.put("currentPage", pagination.getCurrentPage()); // 현재 페이지
        result.put("pageSize", pagination.getPageSize());       // 페이지 크기
        result.put("totalPages", pagination.getTotalPages());   // 총 페이지 수
        result.put("totalRecord", pagination.getTotalRecord()); // 총 레코드 수
        
        log.info("result -----------------: {}", result);
        return ResponseEntity.ok(result);  // ✅ Map 형태로 반환
    }


    // 상품 문의 상세조회 API
    @GetMapping("/detail/product/{boardId}")  // URL 패턴: /admin/board/detail/product/123
    public ResponseEntity<?> getProductBoardDetail(
            @PathVariable String boardId,     // URL 경로의 {boardId}
            @RequestParam String userId       // 쿼리 파라미터 ?userId=값
    ) {
        log.info("📦 상품 문의 상세조회 API 호출됨");
        log.info("상세조회 boardId -----------------: {}", boardId);
        log.info("상세조회 userId -----------------: {}", userId);
        QnaProductVO boardData = qnaProductService.getQnaProductDetail(boardId, userId);
        
        CommentsVO savedComment = commentsService.getCommentById(boardId, "product");
        log.info("savedComment -----------------: {}", savedComment);
        boardData.setComment(savedComment);
        
        return ResponseEntity.ok(boardData);
    }

    // 상품 문의 답변 등록 API
    @PostMapping("/detail/comment/product/{boardId}")
    public ResponseEntity<?> postProductComment(
            @PathVariable String boardId,
            @RequestBody CommentsVO commentsVO,
            HttpServletRequest request
    ) {
        log.info("📦 상품 문의 답변 등록 API 호출됨");

        // CommentsVO 객체 생성
        commentsVO.setCommentType("product");
        commentsVO.setQnaRefId(boardId);
        commentsVO.setComDate(LocalDateTime.now());

        log.info("commentsVO -----------------: {}", commentsVO);

        // 답변 등록 서비스 호출
        int result = commentsService.insertComment(commentsVO);
        
        log.info("댓글 등록 결과 (영향받은 행 수) -----------------: {}", result);
        
        CommentsVO savedComment = commentsService.getCommentById(commentsVO.getQnaRefId(), commentsVO.getCommentType());

        return ResponseEntity.ok(savedComment);
    }

    // 답변 수정  
    @PutMapping("detail/comment/product/{commentId}")
    public ResponseEntity<?> updateComment(@PathVariable String commentId, 
            @RequestBody CommentsVO commentsVO) {
        log.info("📦 답변 수정 API 호출됨");
        log.info("commentId -----------------: {}", commentId);
        log.info("commentsVO -----------------: {}", commentsVO);

        commentsVO.setCommentId(commentId); 
        commentsVO.setComModify(LocalDateTime.now());  

        commentsService.postCommentUpdate(commentsVO);

        return ResponseEntity.ok(commentsVO);
    }

    // 답변 삭제
    @DeleteMapping("detail/comment/product/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable String commentId) {
        log.info("📦 답변 삭제 API 호출됨");
        log.info("commentId -----------------: {}", commentId);
        int result = commentsService.postCommentDelete(commentId);
        return ResponseEntity.ok(result);
    }

    // 상품 문의 게시물 삭제 [다중 , 단일]가능 
    @DeleteMapping("/detail/product")
    public ResponseEntity<?> deleteProductBoard(@RequestBody List<String> boardId) {
        log.info("📦 상품 문의 게시물 삭제 API 호출됨");
        log.info("삭제 할 게시물 아이디 배열: {}", boardId);
        int result = qnaProductService.deleteProductBoard(boardId);
        return ResponseEntity.ok(result);
    }

}
