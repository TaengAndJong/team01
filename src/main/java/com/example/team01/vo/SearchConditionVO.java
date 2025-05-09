package com.example.team01.vo;


import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;


@ToString
@Getter
@Setter
@NoArgsConstructor
public class SearchConditionVO {
    private String searchType; // 검색 분류
    private String keyword; // 검색 키워드
}
