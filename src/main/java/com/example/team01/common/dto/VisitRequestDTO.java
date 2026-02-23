package com.example.team01.common.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VisitRequestDTO {
    private String pageUrl;
    private String userAgent;
    private String ipAddress;
    private LocalDateTime visitTime = LocalDateTime.now(); //PSQL은 LOCADATETIME 시 timestamp without time zone
    private String sessionId;
}


/*
* @Data 는
* @Getter , @Setter ,@ToString, @EqualsAndHashCode , @RequiredArgsConstructor
* 전부 포함
*
* DTO에서는 getter, builder , 기본생성자 ,모든 필드를 파라미터로 받는 생성자 까지만
* */