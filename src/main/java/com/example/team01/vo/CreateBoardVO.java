package com.example.team01.vo;

import org.springframework.web.multipart.MultipartFile;

import java.io.Serializable;
import java.util.List;

public class CreateBoardVO implements Serializable {
    private String title; // 게시물 제목
    private String content; // 게시물 내용
    private String clientId; // 사용자 Id
    private String name; // 사용자 실명
    private List<MultipartFile> files; // 첨부파일 (다중)
    private MultipartFile file; // 첨부파일 (단일)

    // getter/setter 생성
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getClientId() { return clientId; }
    public void setClientId(String clientId) { this.clientId = clientId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public List<MultipartFile> getFiles() { return files; }
    public void setFiles(List<MultipartFile> files) { this.files = files; }

    public MultipartFile getFile() { return file; }
    public void setFile(MultipartFile file) { this.file = file; }

    @Override
    public String toString() {
        return "CreateBoardVO{" +
                "title='" + title + '\'' +
                ", content='" + content + '\'' +
                ", clientId='" + clientId + '\'' +
                ", name='" + name + '\'' +
                ", files=" + files +
                ", file=" + (file != null ? file.getOriginalFilename() : "null") +
                '}';
    }
}



