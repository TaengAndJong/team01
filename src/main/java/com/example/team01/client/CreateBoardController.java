package com.example.team01.client;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/board")
@RestController
public class CreateBoardController {
    @PostMapping (value= "/createBoard")
    public ResponseEntity<?> postCreateBoard( @RequestParam("category") String category,
                                              @RequestParam("title") String title,
                                              @RequestParam("content") String content){
        log.info("게시판 생성 요청 수신됨"
        );
        log.info("카테고리: {}", category);
        log.info("제목: {}", title);
        log.info("내용: {}", content);
        return ResponseEntity.ok("통신 완료");
    }
}
