package com.example.team01.category.service;

import com.example.team01.category.dao.CategoryDao;
import com.example.team01.vo.CategoryVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@RequiredArgsConstructor
@Service
public class CategoryImple implements CategoryService {

    private final CategoryDao dao;

    @Override
    public  List<CategoryVO> getAllCategories() {

        return dao.categoryList();
    }
}

//하나의 맵으로 담아서 보내야함

// cateDepthLevel이 1인 경우
