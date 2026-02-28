package com.example.team01.admin.service;

import com.example.team01.utils.Pagination;
import com.example.team01.vo.AdminBookVO;
import com.example.team01.vo.BookVO;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.util.List;

public interface AdminBookService {

    public List<AdminBookVO> getAllBooks(Pagination pagination);

    public AdminBookVO deTailBook(Long bookId);
    public void  createBook(AdminBookVO book,List<MultipartFile> images);
    public void updateBook(AdminBookVO book);
    public void  deleteBooks(List<Long> bookIds);
    //public List<BookVO> searchBook(String type, String field, String keyword);
}
