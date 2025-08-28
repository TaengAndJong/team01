package com.example.team01.vo;

import lombok.*;
import java.io.Serializable;
import java.time.LocalDateTime;

@ToString
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CommentsVO implements Serializable{
    private String commentId; // 댓글 번호
    //private String parentCmtId; // 부모 댓글 번호 (트리형 구조 시 사용)
    private String commentType; // 댓글 타입
    private String commentCon; // 댓글 내용
    private String comWriter; // 댓글 작성자
    private LocalDateTime comDate; // 댓글 작성일
    private LocalDateTime comModify; // 댓글 수정일
    private String qnaRefId; // 게시물 번호
}
