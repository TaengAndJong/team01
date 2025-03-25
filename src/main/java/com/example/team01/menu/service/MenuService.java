package com.example.team01.menu.service;

import com.example.team01.vo.MenuVO;

import java.util.List;
import java.util.Map;


public interface MenuService {

    public Map<String, List<MenuVO>> getSelectAllMenu();

}
