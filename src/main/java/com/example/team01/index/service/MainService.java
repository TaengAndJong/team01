package com.example.team01.index.service;

import com.example.team01.vo.BookVO;

import java.util.List;
import java.util.Map;

public interface MainService {

    //전체 조회해온 도서를 ebook,국내, 국외 ,기타? 로 나누기
    public Map<String,List<BookVO>> getPartOfBooks();

}
