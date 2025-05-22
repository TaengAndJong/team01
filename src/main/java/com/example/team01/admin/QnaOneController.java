package com.example.team01.admin;
import com.example.team01.admin.service.QnaOneService;
import com.example.team01.utils.Pagination;
import com.example.team01.vo.QnaOneVO;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@Slf4j
@RequiredArgsConstructor
@RequestMapping("/admin/board")
@RestController
public class QnaOneController {

    private final QnaOneService qnaOneService; // 의존성 주입


//        @GetMapping("/qnaOneList")
//        public ResponseEntity<?> getOneBoard() {
//
//            // QnaService를 통해 데이터 조회
//            List<QnaOneVO> qnaOneData = qnaOneService.getAllQnaOneData();
//            log.info("getQnaOneList client id0-----------:{}", qnaOneData);
//            // 로그 출력 (디버깅용)
//            log.info("QnA 데이터 조회: {}", qnaOneData);
//            return ResponseEntity.ok(qnaOneData);
//        }


        @GetMapping("/qnaOneList")
        public ResponseEntity<?>  getQnaOneList(@RequestParam(defaultValue = "1") int currentPage, @RequestParam(defaultValue = "6") int pageSize, HttpServletRequest request) {

            log.info("도서 목록 API 호출됨");
            //페이지 계산 클래스 불러오기
            Pagination pagination = new Pagination(currentPage, pageSize); //현재페이지 && 보여줄 페이지 수

            log.info("pagination -----------------: {} pageSize:{}",currentPage,pageSize);

            //서비스로 데이터 넘기기
            List<QnaOneVO> QnaOneList  = qnaOneService.getAllQnaOneData(pagination);

            return ResponseEntity.ok("통신 완료");
        }
}

