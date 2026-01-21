package com.example.team01.menu.service;

import com.example.team01.menu.dao.MenuDao;
import com.example.team01.vo.MenuVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@Service
public class MenuServiceImple implements MenuService {

    private final MenuDao dao;

    @Override
    public  Map<String, List<MenuVO>> getSelectAllMenu() {
//        log.info("getSelectAllMenu--------------",dao.selectAllMenu());

        List<MenuVO> menuList = dao.selectAllMenu(); // 메뉴 전체조회 해오는 메소드
        List<MenuVO> clientList=new ArrayList<>(); // 사용자메뉴
        List<MenuVO> adminList=new ArrayList<>(); // 관리자메뉴
        List<MenuVO> commonList=new ArrayList<>(); // 공통메뉴
        // 배열리스트를 최종적으로 담아줄 Map 객체
        Map<String, List<MenuVO>> menuMap = new HashMap<>();

        for(MenuVO vo : menuList){

            if(vo.getMenuType().equals("사용자")){
                clientList.add(vo);
            }else if(vo.getMenuType().equals("관리자")){
                adminList.add(vo);
            }else{
            log.info("vo:{}", vo.getMenuType().equals("공통"));

                commonList.add(vo);
            }
        }

        menuMap.put("clientList",clientList);
        menuMap.put("adminList",adminList);
        menuMap.put("commonList",commonList);

        return menuMap;
    }
}
