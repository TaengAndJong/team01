package com.example.team01.admin;
import com.example.team01.admin.service.QnaOneService;
import com.example.team01.utils.Pagination;
import com.example.team01.vo.QnaOneVO;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Slf4j
@RequiredArgsConstructor
@RequestMapping("/admin/board")
@RestController
public class QnaOneController {

    private final QnaOneService qnaOneService; // 의존성 주입

        @GetMapping("/qnaOneList")
        public ResponseEntity<?>  getQnaOneList(@RequestParam(defaultValue = "1") int currentPage, @RequestParam(defaultValue = "6") int pageSize, HttpServletRequest request) {
        log.info("currentPage = {}, pageSize = {} " , currentPage, pageSize);
        //확인 완료

        log.info("도서 목록 API 호출됨");
            //페이지 계산 클래스 불러오기

        // 클래스    참조변수  인스턴스생성  생성자호출 (매개 변수 , 매개 변수)
        Pagination pagination = new Pagination(currentPage, pageSize); //현재페이지 && 보여줄 페이지 수

         //서비스로 데이터 넘기기
         List<QnaOneVO> qnaOneList  = qnaOneService.getAllQnaOneList(pagination);

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
}

