package com.example.team01.pages.service;

import com.example.team01.vo.PageVO;

import java.util.List;


public interface PageService {

    public PageVO pageOne(String pageId);
    public List<PageVO> pageList();
    public int insert(PageVO pageVO);

}
