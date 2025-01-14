package com.example.team01.pages;


import com.example.team01.pages.service.PageService;
import com.example.team01.vo.PageVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@Slf4j
@RequestMapping("/page")
@RestController
@RequiredArgsConstructor
public class PageController {

    private final PageService pageService;

    @GetMapping()
    public List<PageVO> test() {
        List<PageVO> data = pageService.pageList();
        log.info("test :{}",data);
        return data;
    }

    @GetMapping("/test")
    public List<PageVO> test2() {
        List<PageVO> data = pageService.pageList();
        log.info("test :{}",data);
        return data;
    }

    @PostMapping()
    public void insert(@RequestBody PageVO pageVO) {

        log.info("Received data: {}", pageVO);
        // pageVO 객체에는 {pageId, pagePath, pageName}이 포함되어 있음
        pageService.insert(pageVO); // 서비스 로직에서 DB에 삽입

    }



}


//   //@ResponseBody // 서버가 클라이언트서버로 값을 반환할 때 , 반환 값이 JSON 형식으로 자동 변환되도록 합니다.
//@RestController 사용하면 ResponseBody 생략가능