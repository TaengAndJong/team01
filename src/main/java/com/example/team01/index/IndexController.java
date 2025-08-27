package com.example.team01.index;


import com.example.team01.index.service.MainService;
import com.example.team01.menu.service.MenuService;
import com.example.team01.utils.FileUtils;
import com.example.team01.vo.BookVO;
import com.example.team01.vo.MenuVO;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
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
import java.util.stream.Collectors;

// api 는 localhost:port/api
// getMapping 은 localhost:port/api 다음의 경로 /test
//localhost:port/api/test


@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/")
public class IndexController {

    private final MainService mainService;
    private final FileUtils fileUtils;

    //getMapping index 페이지 명시적으로 해주지 않으면 데이터 전송에 충돌 생길 수 있음!
    @GetMapping()
    public ResponseEntity<?> index() {
        //기본파라미터 매칭 안될때 
        log.info("index 기본메서드");
        return ResponseEntity.ok(" 기본 인덱스");
    }


    //getMapping
    @GetMapping(params="bookSlide") // 동일 경로여도 옵션에따라 경로가 다르게 지정 됨
    public ResponseEntity<?> getBooksMapping(@RequestParam(required = false) String bookSlide
    , HttpServletRequest request) {

        log.info("mainController---books:{}", bookSlide);
        //슬라이드에 들어갈 데이터 가져오기
        Map<String,List<BookVO>> data = mainService.getPartOfBooks(); //서비스에서 데이터 가져오기
        log.info("mainController---data:{}", data);
        //Entry는 key,value 형태
        for(Map.Entry<String,List<BookVO>> entry : data.entrySet()){
            log.info("mainController---entry.getKey==1111:{}", entry.getKey());
            log.info("mainController---entry.getValue==1111:{}", entry.getValue()); // entry의 value는 List<BookVO>
            List<BookVO> changeImgPath =
                    entry.getValue().stream()//배열을 스트림으로 전개
                            .map(bookVO->{//map함수를 통해 객체를 순회하면서 이미지의 경로를 변경
                                return fileUtils.changeImgPath(bookVO,request);
                    }).collect(Collectors.toList()); // 흩어진 데이터를 List 형태로 복원하여 반환
            entry.setValue(changeImgPath); // 기존 value를 변경된 데이터로 다시 재설정
        } 
        return ResponseEntity.ok(data); // 클라이언트로 응답을 보내기
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
