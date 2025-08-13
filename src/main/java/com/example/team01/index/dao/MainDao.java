package com.example.team01.index.dao;


import com.example.team01.vo.BookVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;


@Mapper
public interface MainDao {

    public List<BookVO> selectBooks();//도서의 전체 데이터 조회


}