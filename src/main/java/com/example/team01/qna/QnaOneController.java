package com.example.team01.qna;

import com.example.team01.qna.service.QnaOneService;
import com.example.team01.vo.QnaOneVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@Slf4j
@RequestMapping("/admin/board") // 전역 ResponseBody
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@RestController
public class QnaOneController {

    private final QnaOneService qnaOneService; // 의존성 주입

    @GetMapping("/qnaOneList") // 1:1 문의 리스트 출력
    public List<QnaOneVO>  getQnaOne(@RequestParam("clientId") String clientId) {
        log.info("getQnaOneList client id0-----------: {}", clientId);
        // QnaService를 통해 데이터 조회
        List<QnaOneVO> qnaOneData = qnaOneService.getUserQnaOneData(clientId);

        // 로그 출력 (디버깅용)
        log.info("QnA 데이터 조회: {}", qnaOneData);

        return qnaOneData; // 조회된 데이터를 반환
    }

}

// 아래의 주석 처리된 코드 부분은 필요 없는 경우 삭제하거나, 별도 메서드로 분리하세요.
// @GetMapping("/qna")
// public String getQna() {
//     String Data = "qna 데이터";
//     return Data;
// }