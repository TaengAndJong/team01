package com.example.team01.vo;


import lombok.*;
import lombok.extern.slf4j.Slf4j;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@ToString
@Getter // 은닉화된 정보를 캡슐화
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CategoryVO implements Serializable {

    //기존 테이블에서 존재하는 컬럼
    private String cateId;
    private String cateNames;
    private String parentId;
    private String depthLevel;
    private String fullPath;
}
