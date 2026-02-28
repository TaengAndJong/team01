package com.example.team01.book.dao;

import com.example.team01.vo.BookImageVO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface BookImageDao {

    public int insertBookImages(BookImageVO bookImageVO);

}
