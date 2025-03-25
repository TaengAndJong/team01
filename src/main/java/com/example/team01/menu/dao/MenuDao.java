package com.example.team01.menu.dao;

import com.example.team01.vo.MenuVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface MenuDao {
    //전역 주소 조회 메서드 ==> header만 선언 ==> Mapper에서 body 작성
    public List<MenuVO> selectAllMenu();
}
