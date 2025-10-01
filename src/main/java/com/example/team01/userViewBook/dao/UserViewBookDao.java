package com.example.team01.userViewBook.dao;

import com.example.team01.vo.UserViewBookVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface UserViewBookDao {

    //사용자 조회 도서 insert
    public int insertUserViewBook(@Param("bookId") String bookId, @Param("clientId") String clientId);

    // 사용자 조회 도서 select
    public List<UserViewBookVO> selectUserViewBook(@Param("clientId") String clientId);

}
