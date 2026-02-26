package com.example.team01.admin.service;

import com.example.team01.utils.Pagination;
import com.example.team01.vo.AdminBookVO;
import com.example.team01.vo.BookVO;

import java.io.FileNotFoundException;
import java.util.List;

public interface AdminBookService {

    public List<AdminBookVO> getAllBooks(Pagination pagination);

    public AdminBookVO deTailBook(Long bookId);
    public int createBook(AdminBookVO book);
    public void updateBook(AdminBookVO book);
    public int deleteBooks(List<Long> bookIds);
    //public List<BookVO> searchBook(String type, String field, String keyword);
}
