package com.example.team01.book.service;

import com.example.team01.utils.Pagination;
import com.example.team01.vo.AdminBookVO;
import com.example.team01.vo.BookVO;

import java.io.FileNotFoundException;
import java.util.List;

public interface BookService {

    //book 전체 조회
    public List<BookVO> selectAllBooks();

    //book 국내, 국외, 전자로 나누어 조회

}
