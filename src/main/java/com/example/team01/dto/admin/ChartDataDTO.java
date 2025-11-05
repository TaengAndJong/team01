package com.example.team01.dto.admin;

import lombok.*;

@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class ChartDataDTO {
    private String visitTime; // 날짜
    private int visitCount; // 방문자 수
    private int pageViewCount; //페이지 뷰
}
