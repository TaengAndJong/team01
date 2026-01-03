package com.example.team01.dto.common;

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
