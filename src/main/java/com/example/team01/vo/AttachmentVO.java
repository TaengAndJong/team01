package com.example.team01.vo;

import java.sql.Timestamp;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString(exclude = "fileData") // fileData 제외 가능
public class AttachmentVO {
    private String attachmentID;
    private String fileName;
    private String fileType;
    private Long fileSize;
    private byte[] fileData;
    private Timestamp uploadDate;
    private String uploader;
    private String boardType;
    private String category;
    private List<MultipartFile> files;
}
