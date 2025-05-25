package com.example.team01.admin.service;

import com.example.team01.utils.Pagination;
import com.example.team01.vo.AdminBookVO;

import java.io.FileNotFoundException;
import java.util.List;

public interface AdminBookService {

    public List<AdminBookVO> getAllBooks(Pagination pagination);

    public AdminBookVO deTailBook(String bookId);
    public int createBook(AdminBookVO book) throws FileNotFoundException;
    public int updateBook(AdminBookVO book) throws FileNotFoundException;
    public int deleteBooks(List<String> bookIds);
    // public List<BookVO> searchBook(String type, String field, String keyword);
}
