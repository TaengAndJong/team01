package com.example.team01.vo;

import org.springframework.web.multipart.MultipartFile;

import java.io.Serializable;
import java.util.List;

public class CreateBoardVO implements Serializable {
    private String title; // 게시물 제목
    private String content; // 게시물 내용
    private String clientId; // 사용자 Id
    private String name; // 사용자 실명
    private List<MultipartFile> files; // 첨부파일
}
