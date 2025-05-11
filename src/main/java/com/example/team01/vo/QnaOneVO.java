package com.example.team01.vo;

import lombok.*;
import jakarta.persistence.Id; // 관계형 디비에서 사용
import java.io.Serializable;
import java.time.LocalDateTime;

@ToString
@Getter // 은닉화된 정보를 캡슐화
@Setter
@NoArgsConstructor//기본생성자
@AllArgsConstructor //파라미터로 받는 생성자 전부 생성, 객체 생성시 모든 필드 초기화
public class QnaOneVO implements Serializable{

    @Id
    private String qnaOneId; // 1:1 문의 index
    private String qnaTitle; // 1:1 문의 제목
    private String qbaContent; // 1:1 문의 내용
    private String qnaWriter; // 1:1 문의 작성자
    private LocalDateTime qnaDate; // 1:1 문의 날짜 현재시간으로
    private LocalDateTime qnaDel; // 1:1 문의 삭제 여부
    private String qnaStatus; // 1:1 문의 답변 상태
    private String clientId; // 1:1 문의 작성자 아이디
    private String roleId; // 1:1 문의 작성자 권한
    private String attachmentID; // 1:1 문의 첨부 이미지
}