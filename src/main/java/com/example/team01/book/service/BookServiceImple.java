package com.example.team01.book.service;

import com.example.team01.book.dao.BookDao;
import com.example.team01.vo.BookVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;


@Slf4j
@RequiredArgsConstructor
@Service
public class BookServiceImple implements BookService{

    private final BookDao dao;

    @Override
    public List<BookVO> getAllBooks() {
        return dao.selectAllBook();
    }
}
