package com.example.team01.admin;
import com.example.team01.admin.service.QnaOneService;
import com.example.team01.vo.QnaOneVO;
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


        @GetMapping("/qnaOneList")
        public ResponseEntity<?> getOneBoard() {

            // QnaService를 통해 데이터 조회
            List<QnaOneVO> qnaOneData = qnaOneService.getAllQnaOneData();
            log.info("getQnaOneList client id0-----------:{}", qnaOneData);
            // 로그 출력 (디버깅용)
            log.info("QnA 데이터 조회: {}", qnaOneData);
            return ResponseEntity.ok(qnaOneData);
        }


}

