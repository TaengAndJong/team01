package com.example.team01.client.service;

import org.springframework.web.multipart.MultipartFile;


/**
 * 게시글 생성 서비스 인터페이스
 */
public interface CreateBoardService {
    
    /**
     * 단일 파일로 게시글 생성
     * @param category 카테고리
     * @param title 제목
     * @param content 내용
     * @param clientId 사용자 ID
     * @param name 사용자 이름
     * @param files 첨부파일 (단일, 다중)
     */
    void createBoard(String category, String title, String content, String clientId, String name, MultipartFile file);

}
