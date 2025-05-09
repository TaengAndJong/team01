package com.example.team01.vo;


import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;


@ToString
@Getter
@Setter
@NoArgsConstructor
public class SearchVO {
    private String type; // 검색 1차 분류
    private String field; // 검색 2차 분류
    private String keyword; // 검색 키워드
}
