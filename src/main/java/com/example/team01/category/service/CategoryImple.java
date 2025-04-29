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
    public  Map<String, List<CategoryVO>> getAllCategories() {
        log.info("getAllCategories:{}",dao.categoryList());

        //전체 카테고리 가져오기
        List<CategoryVO> allCategories = dao.categoryList();
        //드롭박스에 뿌릴 각 데이터목록 저장할 List 타입 변수
        List<CategoryVO> firstDepth = new ArrayList<>();
        List<CategoryVO> secondDepth = new ArrayList<>();
        List<CategoryVO> thirdDepth = new ArrayList<>();

        //향상된 for문으로 순회하면서 데이터 담기
        for(CategoryVO categoryVO : allCategories){
            switch(categoryVO.getDepthLevel()){
                case "1":firstDepth.add(categoryVO); break;
                case "2":secondDepth.add(categoryVO); break;
                case "3":thirdDepth.add(categoryVO); break;
                default:break;
            }
        }
        log.info("firstDapth:{}",firstDepth);
        log.info("secondDepth:{}",secondDepth);
        log.info("thirdDepth:{}",thirdDepth);

        //
        Map<String, List<CategoryVO>> result = new HashMap<>();
        result.put("firstDepth",firstDepth);
        result.put("secondDepth",secondDepth);
        result.put("thirdDepth",thirdDepth);
        return result;
    }
}

//하나의 맵으로 담아서 보내야함

// cateDepthLevel이 1인 경우
