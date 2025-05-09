package com.example.team01.book.service;

import com.example.team01.utils.Pagination;
import com.example.team01.vo.BookVO;

import java.io.FileNotFoundException;
import java.util.List;

public interface BookService {

    public List<BookVO> getAllBooks(Pagination pagination);

    public BookVO deTailBook(String bookId);
    public int createBook(BookVO book) throws FileNotFoundException;
    public int updateBook(BookVO book) throws FileNotFoundException;
    public int deleteBooks(List<String> bookIds);
    public List<BookVO> searchBook(String type, String field, String keyword);


}
