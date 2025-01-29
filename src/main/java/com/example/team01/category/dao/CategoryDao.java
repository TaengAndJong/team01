package com.example.team01.category.dao;

import com.example.team01.vo.CategoryVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface CategoryDao {

    public List<CategoryVO> categoryList();

}
