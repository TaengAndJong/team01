package com.example.team01.menu.service;

import com.example.team01.menu.dao.MenuDao;
import com.example.team01.vo.MenuVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class MenuServiceImple implements MenuService {

    private MenuDao dao;

    @Override
    public List<MenuVO> getSelectAllMenu() {
        log.info("getSelectAllMenu--------------",dao.selectAllMenu);
        return dao.selectAllMenu;
    }
}
