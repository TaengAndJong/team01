package com.example.team01.client.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;
import com.example.team01.vo.CreateBoardVO;


public interface CreateBoardService {

    void createBoard(CreateBoardVO createBoardVO);
    
}
