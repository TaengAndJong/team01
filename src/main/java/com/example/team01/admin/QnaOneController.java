package com.example.team01.admin;
import com.example.team01.admin.service.QnaOneService;
import com.example.team01.utils.Pagination;
import com.example.team01.vo.QnaOneVO;
import com.example.team01.utils.FileUtils;
import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.team01.comments.service.CommentsService;
import com.example.team01.vo.CommentsVO;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Slf4j
@RequiredArgsConstructor
@RequestMapping("/admin/board")
@RestController
public class QnaOneController {

    private final QnaOneService qnaOneService; // 의존성 주입
    private final CommentsService commentsService;
        @GetMapping("/qnaOneList")
        public ResponseEntity<?>  getQnaOneList(
            @RequestParam(defaultValue = "1")
            int currentPage, @RequestParam(defaultValue = "5")int pageSize,
            @RequestParam String userId,
            @RequestParam(required = false) String searchType,
            @RequestParam(required = false) String keyword,
            HttpServletRequest request
            ) {
        
        List<QnaOneVO> qnaOneList = null; // 게시물 데이터 저장 할 변수 생성
        Pagination pagination = new Pagination(currentPage, pageSize); // 페이지네이션 객체 미리 세팅하기
        
        if (keyword != null && !keyword.isEmpty()) { // 검색어 유무에 따라 분기
	    // 검색 키워드 세팅해주기
	    pagination.addDetailCondition("searchType", searchType);
	    pagination.addDetailCondition("keyword", keyword);
	
	    qnaOneList = qnaOneService.getAllQnaOneList(pagination , userId); //검색 된 리스트 데이터

	        for (QnaOneVO qnaOneVO : qnaOneList) {
                log.info("여기--검색 책목록:{}", qnaOneVO);
                // fileUtils.changeImgPath(qnaProductVO,request); // 새로운 이미지주소를 가진  bookVO객체가 반환됨
                log.info("다음--검색 책목록:{}", qnaOneVO);
            }
        }else{

        qnaOneList = qnaOneService.getAllQnaOneList(pagination, userId); // 전체 데이터
        }

            Map<String, Object> result = new HashMap<>();
            result.put("items", qnaOneList);
            result.put("currentPage", pagination.getCurrentPage());
            result.put("pageSize", pagination.getPageSize());
            result.put("totalPages", pagination.getTotalPages());
            result.put("totalRecord", pagination.getTotalRecord());
            log.info("result---get:{}",result);
            // 배열 안에 객체 형태로 내보내려면 원본 Map 사용하지 않고 내보내야함
            return  ResponseEntity.ok(result);
        }
        // 1:1 문의 상세조회 API
    @GetMapping("/detail/one/{boardId}")  // URL 패턴: /admin/board/detail/one/123
    public ResponseEntity<?> getOneBoardDetail(
    @PathVariable String boardId,     // URL 경로의 {boardId}
    @RequestParam String userId       // 쿼리 파라미터 ?userId=값
    ){
    log.info("🔵 1:1 문의 상세조회 API 호출됨");
    log.info("상세조회 boardId -----------------: {}", boardId);
    log.info("상세조회 userId -----------------: {}", userId);
    
    QnaOneVO boardData = qnaOneService.getQnaOneDetail(boardId, userId);
    
    CommentsVO savedComment = commentsService.getCommentById(boardId, "one");
    log.info("savedComment -----------------: {}", savedComment);
    boardData.setComment(savedComment);
    
    return ResponseEntity.ok(boardData);
}

// 1:1 문의 답변 등록 API
@PostMapping("/detail/comment/one/{boardId}")
public ResponseEntity<?> postOneComment(
    @PathVariable String boardId,
    @RequestBody CommentsVO commentsVO,
    HttpServletRequest request
){
    log.info("📦 상품 문의 답변 등록 API 호출됨");

        // CommentsVO 객체 생성
        commentsVO.setCommentType("one");
        commentsVO.setQnaRefId(boardId);
        commentsVO.setComDate(LocalDateTime.now());

    log.info("commentsVO -----------------: {}", commentsVO);

    // 답변 등록 서비스 호출
    int result = commentsService.insertComment(commentsVO);
    
    log.info("댓글 등록 결과 (영향받은 행 수) -----------------: {}", result);
    
    CommentsVO savedComment = commentsService.getCommentById(commentsVO.getQnaRefId(), commentsVO.getCommentType());

    // 게시물 답변여부 수정 로직
    log.info("게시물 답변여부 수정 로직");
    qnaOneService.updateQnaOneStatus(boardId);

    return ResponseEntity.ok(savedComment);
}

// 답변 수정
@PutMapping("detail/comment/one/{commentId}")
public ResponseEntity<?> updateComment(@PathVariable String commentId, 
    @RequestBody CommentsVO commentsVO)
    {
        log.info("📦 답변 수정 API 호출됨");
        log.info("commentId -----------------: {}", commentId);
        log.info("commentsVO -----------------: {}", commentsVO);

        commentsVO.setCommentId(commentId); 
        commentsVO.setComModify(LocalDateTime.now());  

        commentsService.postCommentUpdate(commentsVO);

        return ResponseEntity.ok(commentsVO);
    }

    // 답변 삭제
    @DeleteMapping("detail/comment/one/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable String commentId){
        log.info("📦 답변 삭제 API 호출됨");
        log.info("commentId -----------------: {}", commentId);
        int result = commentsService.postCommentDelete(commentId);
        return ResponseEntity.ok(result);
    }

    // 상품 문의 게시물 삭제
@DeleteMapping("/detail/one")
public ResponseEntity<?> deleteProductBoard(@RequestBody List<String> boardId){
    log.info("📦 상품 문의 게시물 삭제 API 호출됨");
    log.info("삭제 할 게시물 아이디 배열: {}", boardId);
    int result = 0;
    qnaOneService.deleteOneBoard(boardId);
    
    return ResponseEntity.ok(result);
}


}