package com.example.team01.qna;


import com.example.team01.login.service.LoginService;
import com.example.team01.qna.service.QnaService;
import com.example.team01.security.UserDetailCustomServiceImple;
import com.example.team01.vo.LoginVO;
import com.example.team01.vo.QnaVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.Map;

@Slf4j
@RequestMapping("/test") // 전역 ResponseBody
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@RestController
public class QnaController {

    private final QnaService qnaService; // 의존성 주입


    /**
     * 특정 사용자 ID에 해당하는 QnA 데이터를 반환
     *
     * @param qnaId 사용자 ID
     * @return QnA 데이터
     **/

    @GetMapping("/qna")
    public QnaVO getQna(@RequestParam("qnaId") String qnaId) {
        // QnaService를 통해 데이터 조회
        QnaVO qnaData = qnaService.getUserQnaData(qnaId);

        // 로그 출력 (디버깅용)
        log.info("QnA 데이터 조회: {}", qnaData);

        return qnaData; // 조회된 데이터를 반환
    }

    // 아래의 주석 처리된 코드 부분은 필요 없는 경우 삭제하거나, 별도 메서드로 분리하세요.
    // @GetMapping("/qna")
    // public String getQna() {
    //     String Data = "qna 데이터";
    //     return Data;
    // }
}
