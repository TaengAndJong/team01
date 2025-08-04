package com.example.team01.admin.dao;

import com.example.team01.utils.Pagination;
import com.example.team01.vo.AdminBookVO;
import com.example.team01.vo.QnaProductVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface QnaProductDao {


    public List<QnaProductVO> getAllQnaProductList(@Param("pagination") Pagination pagination);

    int totalRecord(@Param("pagination") Pagination pagination);
}
