package com.example.team01.menu;


import com.example.team01.menu.service.MenuService;
import com.example.team01.vo.MenuVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Slf4j
@RestController
public class MenuController {

    MenuService menuService;
    //1. 서버로부터 get 요청을 받음
    @GetMapping("/**")
    public Map<String,Objects> getMapping(){

        //2.service로 전체 메뉴 가져오기
        List<MenuVO> allMenu = menuService.getSelectAllMenu();
        log.info("allMenu---------------" , allMenu);

       // 5. ResponseEntity로 응답 반환
        return null; // 200 OK 상태로 응답 반환
    }
}
