package com.example.team01.pages;

import com.example.team01.vo.PageVO;
import org.springframework.stereotype.Service;

import java.util.List;


public interface PageService {

    public PageVO pageOne(String pageId);
    public List<PageVO> pageList();

}
