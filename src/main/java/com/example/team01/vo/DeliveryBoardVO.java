package com.example.team01.vo;

import lombok.*;

import org.springframework.web.multipart.MultipartFile;
import java.io.Serializable;
import java.util.List;


@ToString
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DeliveryBoardVO implements Serializable {
    private String qnaDelId; // 게시물 번호
    private String qnaTitle; // 게시물 제목
    private String qnaContent; // 게시물 내용
    private String clientId; // 사용자 Id
    private String qnaDate; // 게시물 작성일    
    private String qnaWriter; // 사용자 실명
    private String category; // 게시물 카테고리
    private List<MultipartFile> files; // 첨부파일 (다중)
    private String attachmentID; // 저장된 파일명들 (ex: "a.jpg,b.jpg")
    }
