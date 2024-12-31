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
public class QnaVO implements Serializable{

    @Id
    private String qnaId; // 사용자 QnA index
    private String qnbType; // 문의타입
    private String userId; // 사용자 ID
    private String roleId; // 권한 ID
    private String qnaOneId;
    private String qnaTitle;
    private String qnaContent;
    private String qndWriter;
    private LocalDateTime qnaDate;
    private LocalDateTime qnaDel;
    private String qndStatus;
}