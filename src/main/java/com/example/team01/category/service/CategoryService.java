package com.example.team01.category.service;

import com.example.team01.vo.CategoryVO;

import java.util.List;
import java.util.Map;

public interface CategoryService {

        public Map<String, List<CategoryVO>> getAllCategories();

}
