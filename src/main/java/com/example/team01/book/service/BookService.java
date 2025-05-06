package com.example.team01.book.service;

import com.example.team01.vo.BookVO;
import com.example.team01.vo.SearchVO;
import org.apache.ibatis.annotations.Param;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.util.List;

public interface BookService {

    public List<BookVO> getAllBooks();
    //public int createBook(BookVO book, List<MultipartFile> bookImgPath);
    public BookVO deTailBook(String bookId);
    public int createBook(BookVO book) throws FileNotFoundException;
    public int updateBook(BookVO book) throws FileNotFoundException;
    public int deleteBooks(List<String> bookIds);
    public List<BookVO> searchBook(String type, String field, String keyword);

}
