package com.example.team01.menu;


import com.example.team01.menu.service.MenuService;
import com.example.team01.vo.MenuVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;


@Slf4j
@RequiredArgsConstructor
@RestController
public class MenuController {

    private final MenuService menuService;
    //1. 서버로부터 get 요청을 받음
    @GetMapping("/menu")
    public Map<String, List<MenuVO>> getMapping(){

        //2.service로 전체 메뉴 가져오기
        Map<String, List<MenuVO>> allMenu = menuService.getSelectAllMenu();

       // 가공한 데이터 클라이언트로 반환
        return allMenu;
    }
}
