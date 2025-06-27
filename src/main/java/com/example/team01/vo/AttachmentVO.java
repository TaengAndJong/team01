package com.example.team01.vo;

import java.sql.Timestamp;

public class AttachmentVO {
    private String attachmentID;
    private String fileName;
    private String fileType;
    private Long fileSize;
    private byte[] fileData;
    private Timestamp uploadDate;
    private String uploader;
    private String boardType;
}
