package com.example.team01.userViewBook.service;

import com.example.team01.vo.UserViewBookVO;

import java.util.List;

public interface UserViewBookService {

    //사용자 조회 도서 insert
    public int insertUserViewBook(String bookId,String clientId);

    // 사용자 조회 도서 select
    public List<UserViewBookVO> selectUserViewBook(String bookId);

}
