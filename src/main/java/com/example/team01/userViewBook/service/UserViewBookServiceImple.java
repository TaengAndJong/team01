package com.example.team01.userViewBook.service;

import com.example.team01.userViewBook.dao.UserViewBookDao;
import com.example.team01.vo.UserViewBookVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Transactional // 스프링에서 트랜잭션 관리
@Service
public class UserViewBookServiceImple implements UserViewBookService {

    private final UserViewBookDao dao;


    @Override
    public int insertUserViewBook(String bookId,String clientId) {
        log.info("insertUserViewBook ---------:{}",bookId);
        int result = dao.insertUserViewBook(bookId,clientId);

        return result;
    }

    @Override
    public List<UserViewBookVO> selectUserViewBook(String bookId) {
        log.info("selectUserViewBook ------------:{}",bookId);

        return List.of();
    }
}
