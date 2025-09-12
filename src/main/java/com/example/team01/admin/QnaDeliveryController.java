package com.example.team01.admin;

import com.example.team01.admin.service.QnaDeliveryService;
import com.example.team01.utils.Pagination;
import com.example.team01.vo.AdminBookVO;
import com.example.team01.vo.QnaDeliveryVO;
import com.example.team01.utils.FileUtils;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import com.example.team01.comments.service.CommentsService;
import com.example.team01.vo.CommentsVO;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/admin/board")
public class QnaDeliveryController {
  private final CommentsService commentsService;
  private final QnaDeliveryService qnaDeliveryService;
  private final FileUtils fileUtils;

  @GetMapping("/qnaDeliveryList")
  public ResponseEntity<?>  getQnaDeliveryList(@RequestParam(defaultValue = "1") int currentPage, @RequestParam(defaultValue = "6") int pageSize, HttpServletRequest request) {
  log.info("currentPage = {}, pageSize = {} " , currentPage, pageSize);
  //확인 완료

  log.info("도서 목록 API 호출됨 이거");
      //페이지 계산 클래스 불러오기

  // 클래스    참조변수  인스턴스생성  생성자호출 (매개 변수 , 매개 변수)
  Pagination pagination = new Pagination(currentPage, pageSize); //현재페이지 && 보여줄 페이지 수

   //서비스로 데이터 넘기기
  List<QnaDeliveryVO> qnaDeliveryList  = qnaDeliveryService.getAllQnaDeliveryList(pagination);
   log.info("qnaDeliveryList size------------ = {}", qnaDeliveryList.size());

      Map<String, Object> result = new HashMap<>();
      result.put("items", qnaDeliveryList);
      result.put("currentPage", pagination.getCurrentPage());
      result.put("pageSize", pagination.getPageSize());
      result.put("totalPages", pagination.getTotalPages());
      result.put("totalRecord", pagination.getTotalRecord());
      log.info("result---get:{}",result);
      // 배열 안에 객체 형태로 내보내려면 원본 Map 사용하지 않고 내보내야함
      return  ResponseEntity.ok(result);
  }

  @PostMapping(value = "/qnaDeliveryList")
public ResponseEntity<?> getSearchQnaDeliveryList(
      @RequestParam(required = false) String searchType,
      @RequestParam String keyword,
      @RequestParam(defaultValue = "1") int page,
      @RequestParam(defaultValue = "10") int pageSize,
      HttpServletRequest request ){
      log.info("도서 목록 배송 문의 searchkeyword API 호출됨");
      log.info("배송 문의 searchType -------------------: {}",searchType);
      log.info("배송 문의 keyword -----------------: {}",keyword);

      //페이지 계산 클래스 불러오기
      Pagination pagination = new Pagination(page, pageSize);
      log.info("배송 문의 pagination -----------------: {}",pagination);

      //검색필터 설정해주기
      pagination.addDetailCondition("searchType", searchType);
      pagination.addDetailCondition("keyword", keyword);

      log.info("배송 문의 DetailContion-----:{}",pagination.getDetailCondition());

      //서비스로 검색 파라미터 넘겨주기
      List<QnaDeliveryVO> qnaDeliveryList = qnaDeliveryService.getAllQnaDeliveryList(pagination);

      // 레코드 순회
      for (QnaDeliveryVO qnaDeliveryVO : qnaDeliveryList) {
          log.info("여기--검색 책목록:{}", qnaDeliveryVO);
//                fileUtils.changeImgPath(qnaDeliveryVO,request); // 새로운 이미지주소를 가진  bookVO객체가 반환됨
          log.info("다음--검색 책목록:{}", qnaDeliveryVO);
      }
      log.info("result -----------------: {}",qnaDeliveryList);
      return ResponseEntity.ok(qnaDeliveryList);
}

    // 배송 문의 상세조회 API
    @GetMapping("/detail/delivery/{boardId}")  // URL 패턴: /admin/board/detail/delivery/123
    public ResponseEntity<?> getDeliveryBoardDetail(
    @PathVariable String boardId,     // URL 경로의 {boardId}
    @RequestParam String userId       // 쿼리 파라미터 ?userId=값
    ){
    log.info("🚚 배송 문의 상세조회 API 호출됨");
    log.info("상세조회 boardId -----------------: {}", boardId);
    log.info("상세조회 userId -----------------: {}", userId);
    QnaDeliveryVO boardData = qnaDeliveryService.getQnaDeliveryDetail(boardId, userId);
    
    CommentsVO savedComment = commentsService.getCommentById(boardId, "delivery");
    log.info("savedComment -----------------: {}", savedComment);
    boardData.setComment(savedComment);
    
    return ResponseEntity.ok(boardData);
}

    // 배송 문의 답변 등록 API
@PostMapping("/detail/comment/delivery/{boardId}")
public ResponseEntity<?> postProductComment(
    @PathVariable String boardId,
    @RequestBody CommentsVO commentsVO,
    HttpServletRequest request
){
    log.info(" 배송 문의 답변 등록 API 호출됨");

        // CommentsVO 객체 생성
        commentsVO.setCommentType("delivery");
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
@PutMapping("detail/comment/delivery/{commentId}")
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
    @DeleteMapping("detail/comment/delivery/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable String commentId){
        log.info("📦 답변 삭제 API 호출됨");
        log.info("commentId -----------------: {}", commentId);
        int result = commentsService.postCommentDelete(commentId);
        return ResponseEntity.ok(result);
    }

    //  배송 문의 게시물 삭제
@DeleteMapping("/detail/delivery/{boardId}")
public ResponseEntity<?> deleteProductBoard(@PathVariable String boardId){
    log.info("📦 상품 문의 게시물 삭제 API 호출됨");
    log.info("상품 문의 게시물 삭제 boardId -----------------: {}", boardId);
    int result = qnaDeliveryService.deleteDeliveryBoard(boardId);
    return ResponseEntity.ok(result);
}

}