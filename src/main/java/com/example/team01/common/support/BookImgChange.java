package com.example.team01.common.support;

import java.util.List;

public interface BookImgChange {

    List<String> getBookImgList();
    String getBookImgPath();// 클라이언트 도서 조회 시, 이미지배열변환에 필요

    void setBookImgList(List<String> list);
    void setBookImgPath(String path);
}
