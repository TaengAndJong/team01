package com.example.team01.client.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import com.example.team01.vo.CreateBoardVO;

@Slf4j
@Service

public interface CreateBoardService {
   public void createBoard(String category, String title, String content, MultipartFile file);
}
