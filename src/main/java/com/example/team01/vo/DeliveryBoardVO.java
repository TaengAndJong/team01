package com.example.team01.vo;

import lombok.*;

import org.springframework.web.multipart.MultipartFile;
import java.io.Serializable;
import java.util.List;
import java.time.LocalDateTime;


@ToString
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DeliveryBoardVO implements Serializable {
    private String qnaDelId; // 게시물 번호
    private String qnaTitle; // 상품 문의 제목
    private String qnaContent; // 상품 문의 내용
    private String qnaWriter; // 상품 문의 작성자
    private LocalDateTime qnaDate; // 상품문의 날짜 현재시간으로
    private LocalDateTime qnaDel; // 상품 문의 삭제 여부
    private String qnaStatus; // 상품 문의 답변 상태
    private String clientId; // 상품 문의 작성자 아이디
    private String roleId; // 상품 문의 작성자 권한
    private String attachmentID; // 상품 문의 첨부 이미지
    private List<AttachmentVO> attachmentList; // 첨부 이미지 리스트 get으로 요청 시
    private CommentsVO comment; // 단일 댓글 반환
    private String category; // 게시물 카테고리
    private List<MultipartFile> files; // 첨부파일 (다중)
    }
