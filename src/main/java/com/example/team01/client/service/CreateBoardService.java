package com.example.team01.client.service;

import org.springframework.web.multipart.MultipartFile;

/**
 * 게시글 생성 서비스 인터페이스
 */
public interface CreateBoardService {
    
    /**
     * 게시글 생성
     * @param category 카테고리
     * @param title 제목
     * @param content 내용
     * @param file 첨부파일
     */
    void createBoard(String category, String title, String content, MultipartFile file);
}
