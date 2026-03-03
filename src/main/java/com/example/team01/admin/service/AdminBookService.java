package com.example.team01.admin.service;

import com.example.team01.admin.dto.AdminBookDetailResponseDTO;
import com.example.team01.admin.dto.AdminBookListResponseDTO;
import com.example.team01.utils.Pagination;
import com.example.team01.vo.AdminBookVO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface AdminBookService {

    public List<AdminBookListResponseDTO> getAllBooks(Pagination pagination);
    public AdminBookDetailResponseDTO deTailBook(Long bookId);
    public void  createBook(AdminBookVO book,List<MultipartFile> images);
    public void updateBook(AdminBookVO book);
    public void  deleteBooks(List<Long> bookIds);
    //public List<BookVO> searchBook(String type, String field, String keyword);
}
