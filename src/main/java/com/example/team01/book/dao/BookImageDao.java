package com.example.team01.book.dao;

import com.example.team01.vo.BookImageVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface BookImageDao {

    public int insertBookImages(BookImageVO bookImageVO);
    public List<String> selectImages(@Param("bookIds") List<Long> bookIds);
   // public int deleteBookImages(@Param("bookIds") List<Long>  bookIds);
}
