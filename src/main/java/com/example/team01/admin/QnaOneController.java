package com.example.team01.admin;
import com.example.team01.admin.service.QnaOneService;
import com.example.team01.utils.Pagination;
import com.example.team01.vo.AdminBookVO;
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
    private final FileUtils fileUtils;
    private final CommentsService commentsService;
        @GetMapping("/qnaOneList")
        public ResponseEntity<?>  getQnaOneList(@RequestParam(defaultValue = "1") int currentPage, @RequestParam(defaultValue = "6") int pageSize, HttpServletRequest request) {
        log.info("currentPage = {}, pageSize = {} " , currentPage, pageSize);
        //확인 완료

        log.info("도서 목록 API 호출됨 이거");
            //페이지 계산 클래스 불러오기

        // 클래스    참조변수  인스턴스생성  생성자호출 (매개 변수 , 매개 변수)
        Pagination pagination = new Pagination(currentPage, pageSize); //현재페이지 && 보여줄 페이지 수

         //서비스로 데이터 넘기기
        List<QnaOneVO> qnaOneList  = qnaOneService.getAllQnaOneList(pagination);
        log.info("qnaOneList size------------ = {}", qnaOneList.size());

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

        @PostMapping(value = "/qnaOneList")
    public ResponseEntity<?> getSearchQnaOneList(
            @RequestParam(required = false) String searchType,
            @RequestParam String keyword,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            HttpServletRequest request ){
            log.info("도서 목록 1:1 문의 searchkeyword API 호출됨");
            log.info("1:1 문의 searchType -------------------: {}",searchType);
            log.info("1:1 문의 keyword -----------------: {}",keyword);

            //페이지 계산 클래스 불러오기
            Pagination pagination = new Pagination(page, pageSize);
            log.info("1:1 문의 pagination -----------------: {}",pagination);

            //검색필터 설정해주기
            pagination.addDetailCondition("searchType", searchType);
            pagination.addDetailCondition("keyword", keyword);

            log.info("1:1 문의 DetailContion-----:{}",pagination.getDetailCondition());

            //서비스로 검색 파라미터 넘겨주기
            List<QnaOneVO> qnaOneList = qnaOneService.getAllQnaOneList(pagination);

            // 레코드 순회
            for (QnaOneVO qnaOneVO : qnaOneList) {
                log.info("여기--검색 책목록:{}", qnaOneVO);
//                fileUtils.changeImgPath(qnaOneVO,request); // 새로운 이미지주소를 가진  bookVO객체가 반환됨
                log.info("다음--검색 책목록:{}", qnaOneVO);
            }
            log.info("result -----------------: {}",qnaOneList);
            return ResponseEntity.ok(qnaOneList);
    }
    
        // 1:1 문의 상세조회 API
    @GetMapping("/detail/one")  // URL 패턴: /admin/board/detail/one/123
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