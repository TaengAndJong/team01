package com.example.team01.index;


import com.example.team01.menu.service.MenuService;
import com.example.team01.vo.MenuVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

// api 는 localhost:port/api
// getMapping 은 localhost:port/api 다음의 경로 /test
//localhost:port/api/test


@Slf4j
@RestController
@RequestMapping("/")
public class IndexController {

//    //getMapping index 페이지 명시적으로 해주지 않으면 데이터 전송에 충돌 생길 수 있음!
//    @GetMapping()
//    public String index() {
//        String data= "main";
//        return data;
//    }

    //getMapping
    @GetMapping(params="bookSlide") // 동일 경로여도 옵션에따라 경로가 다르게 지정 됨
    public ResponseEntity<?> getBooksMapping(@RequestParam(required = false) String bookSlide){

        log.info("mainController---books:{}", bookSlide);

        return ResponseEntity.ok("Hello books");
    }

    //getMapping
    @GetMapping(params="curation")
    public ResponseEntity<?> getCrationMapping(@RequestParam(required = false) String curation){

        log.info("mainController---curations:{}", curation);

        return ResponseEntity.ok("Hello curation");
    }

    //백엔드 매핑주소는 프론트와 동일
    // 프론트 fetch 주소는 백엔드 기준

}
