package com.example.team01.pages;


import com.example.team01.pages.service.PageService;
import com.example.team01.vo.PageVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@Slf4j
@RestController("/api")
public class PageController {

    @Autowired //의존성 주입하기
    private PageService pageService;

    @GetMapping("/page")
    public List<PageVO> test() {
        List<PageVO> data =pageService.pageList();

        log.info("test :{}",data);

        return data;
    }


}


//   //@ResponseBody // 서버가 클라이언트서버로 값을 반환할 때 , 반환 값이 JSON 형식으로 자동 변환되도록 합니다.
//@RestController 사용하면 ResponseBody 생략가능