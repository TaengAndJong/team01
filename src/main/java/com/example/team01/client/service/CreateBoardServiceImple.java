package com.example.team01.client.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.team01.utils.FileUtils;
import com.example.team01.vo.CreateBoardVO;
import com.example.team01.client.dao.CreateBoardDao;

@Slf4j
@RequiredArgsConstructor
@Service
public class CreateBoardServiceImple implements CreateBoardService {
    
    private final CreateBoardDao createBoardDao;
    private final FileUtils fileUtils;

    @Override
    public void createBoard(CreateBoardVO createBoardVO) {
        
        log.info("서비스 임플 VO 객체 데이터: {}", createBoardVO);

        String fileNames = ""; // 전역 설정
        List<MultipartFile> files = createBoardVO.getFiles(); // 첨부파일 데이터 VO 객체에서 가져오기

        log.info("[createBoard 서비스 시작------------------------------------]");

        try {
            // 조건: files가 null 또는 비어있을 경우
            if (files == null || files.isEmpty()) {
                log.info("파일이 첨부되지 않은 업로드.");
            }
            // 조건: 파일 사이즈가 1일 경우
            else if (files.size() == 1) {
                log.info("단일 파일 업로드");
                fileNames = fileUtils.saveFile(files, "board");
                log.info("단일 파일 업로드 fileNames: {}", fileNames);
                createBoardVO.setFileName(fileNames);
            }
            // 조건: 파일 사이즈가 2 이상일 경우
            else if (files.size() > 1) {
                log.info("다중 파일 업로드");
                fileNames = fileUtils.saveFile(files, "board");
                log.info("다중 파일 업로드 fileNames: {}", fileNames);
                createBoardVO.setFileName(fileNames);
            }
            
            createBoardDao.createBoard(createBoardVO);
            log.info("게시물 등록 완료");
            
        } catch (Exception e) { 
            log.error("게시물 등록 중 오류 발생: {}", e.getMessage());
            throw new RuntimeException("게시물 등록 실패", e);
        }
    }
}


// if (files == null || files.isEmpty()) { // 첨부 파일이 없을 시 게시물 등록
//     try{
//         log.info("파일이 첨부되지 않은 업로드.");
//         // 파일 없는 게시물 등록 로직
        
//     }catch(Exception e){
//         log.error("파일 없이 업로드 중 오류 발생: {}", e.getMessage());
//     }
// } else if (files.size() == 1) { // 첨부 파일이 있고 단일 일 때 게시물 등록
//     try{
//         log.info("단일 파일 업로드");
//         // 단일 파일 게시물 등록 로직
//         fileNames = fileUtils.saveFile(files, "board");
//         log.info("단일 파일 업로드 fileNames: {}", fileNames);
        
        
//     }catch(Exception e){
//         log.error("단일 파일 업로드 중 오류 발생: {}", e.getMessage());
//     }
// } else if (files.size() > 1) { // 첨부 파일이 있고 다중 일 때 게시물 등록
//     try{
//         log.info("다중 파일 업로드");
//         // 다중 파일 게시물 등록 로직
//         fileNames = fileUtils.saveFile(files, "board");
        
//     }catch(Exception e){
//         log.error("다중 파일 업로드 중 오류 발생: {}", e.getMessage());
//         log.info("다중 파일 업로드 fileNames: {}", fileNames);
//     }
// }
