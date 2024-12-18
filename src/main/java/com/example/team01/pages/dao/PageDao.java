package com.example.team01.pages.dao;

import com.example.team01.vo.PageVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;


@Mapper
public interface PageDao {

    //서비스에서 사용할 메소드
    public PageVO selectOne(@Param("pageId") String pageId);// 하나 조회
    public List<PageVO> selectAllPage();//전체조회

}
