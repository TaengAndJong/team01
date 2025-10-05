package com.example.team01.board.dashboard.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResponseQnaCntDTO {
    private int delivCnt;//  배송문의
    private int oneCnt;//1:1문의
    private int proCnt;// 상품문의
    private int totalCnt; // 문의 총건수

}