package com.example.team01.vo;

import lombok.*;
import java.util.List;
import java.io.Serializable;


@ToString
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DeliveryBoardListVO implements Serializable {
    private String qnaDelId; // 게시물 번호
    private String title; // 게시물 제목
    private String content; // 게시물 내용
    private String clientId; // 사용자 Id
    private String clientName; // 사용자 실명
    private String category; // 게시물 카테고리
    private List<String> attachmentID; // 저장된 파일명들 (ex: "a.jpg,b.jpg")
}
