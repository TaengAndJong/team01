package com.example.team01.oneboard.service;

import com.example.team01.vo.OneBoardVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

import com.example.team01.utils.FileUtils;
import com.example.team01.oneboard.dao.OneBoardDao;

@Slf4j
@RequiredArgsConstructor
@Service
public class OneBoardServiceImple implements OneBoardService {

    private final FileUtils fileUtils;
    private final OneBoardDao OneBoardDao;

    @Override
    public void CreateOneBoard(OneBoardVO vo) {
        log.info("서비스 임플 VO 객체 데이터: {}", vo);

        String fileNames = ""; // 전역 설정
        List<MultipartFile> files = vo.getFiles(); // 첨부파일 데이터 VO 객체에서 가져오기

        log.info("[oneBoard 서비스 시작------------------------------------]");
        
        try {
            // 조건: files가 null 또는 비어있을 경우
            if (files == null || files.isEmpty()) {
                log.info("파일이 첨부되지 않은 업로드 시작------------------:");
            }
            // 조건: 파일 사이즈가 1일 경우
            else if (files.size() == 1) {
                log.info("단일 파일 업로드 시작");
                fileNames = fileUtils.saveFile(files, "board");
                log.info("단일 파일 업로드 완료 fileNames--------------------: {}", fileNames);
                vo.setFileName(fileNames);
            }
            // 조건: 파일 사이즈가 2 이상일 경우
            else if (files.size() > 1) {
                log.info("다중 파일 업로드 시작");
                fileNames = fileUtils.saveFile(files, "board");
                log.info("다중 파일 업로드 완료 fileNames--------------------: {}", fileNames);
                vo.setFileName(fileNames);
            }

            log.info("file 업로드 후 oneBoardVO 객체 데이터: {}", vo);
            
            // DAO를 통한 게시물 등록
            OneBoardDao.CreateOneBoard(vo);
            log.info("게시물 등록 완료");
            
        } catch (Exception e) {
            log.error("게시물 등록 중 오류 발생", e); 
            throw new RuntimeException("게시물 등록 실패", e);
        }
    }
}
