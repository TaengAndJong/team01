package com.example.team01.book.service;

import com.example.team01.vo.BookVO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface BookService {

    public List<BookVO> getAllBooks();
    //public int createBook(BookVO book, List<MultipartFile> bookImgPath);
    public BookVO deTailBook(String bookId);
    public int createBook(BookVO book);
}
