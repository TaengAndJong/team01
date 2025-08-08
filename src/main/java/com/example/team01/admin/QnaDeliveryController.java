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

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/admin/board")
public class QnaDeliveryController {
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

  }