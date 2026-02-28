package com.example.team01.vo;

import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;

@Setter
@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class BookImageVO implements Serializable { // 직렬화

    private Long imageId; // 이미지 테이블 PK ( PK 는 인덱스 자동 생성)
    private Long bookId; // 도서테이블에서 참조한 FK , 인덱스 기준 , 도서 1권당 여러개 이미지
    private String imagePath; // 이미지 경로
    private String isMain; // 목록 조회일 경우 'Y', 기본값 'N' --> 설정은 비즈니스로직 에서 1개의 이미지만 'Y' 로 설정
    private LocalDateTime createDate;//이미지등록일
}
