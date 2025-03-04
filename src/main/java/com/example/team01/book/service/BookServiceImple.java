package com.example.team01.book.service;

import com.example.team01.book.dao.BookDao;
import com.example.team01.vo.BookVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;


@Slf4j
@RequiredArgsConstructor
@Service
public class BookServiceImple implements BookService{

    private final BookDao dao;

    @Override
    public List<BookVO> getAllBooks() {
        return dao.selectAllBook();
    }

    @Override
    public int createBook(BookVO book) {
        log.info("createBook data------------------111:{}", book );
        int cnt =0;
        if(book != null) {
        log.info("createBook data notnull------------222:{}", book );
            return dao.createBook(book);
        }
        return 0;
    }


}
