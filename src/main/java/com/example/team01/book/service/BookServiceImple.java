package com.example.team01.book.service;

import com.example.team01.book.dao.BookDao;
import com.example.team01.vo.BookVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;


@Slf4j
@RequiredArgsConstructor
@Service
public class BookServiceImple implements BookService{

    private final BookDao dao;

    @Override
    public List<BookVO> getAllBooks() {
        return dao.selectAllBook();
    }

    @Override
    public int createBook(BookVO book) {
        
        String bookImgPath=""; // 데이터베이스에 담을 파일명 담는 문자열 변수
        int cnt =0;
        if(book != null) {
            log.info("createBook에 파일 객체도 담겨서 넘어옴:{}", book );
            log.info("book.file?????:{}", book.getBookImgPath()); // 1개 이상의 파일 객체 (파일 날데이터)

            if(!book.getBookImgPath().isEmpty()) {
                for (MultipartFile file : book.getBookImgPath()) {
                    String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename(); //랜덤 파일 명칭(중복방지)
                    log.info("fileName:{}", fileName);

                    
                    //2. 데이터베이스에 파일 저장( 
                    if(!bookImgPath.equals("")) {
                        bookImgPath= bookImgPath +","+fileName;
                    }else{
                        bookImgPath = fileName;
                    }

                    //실제파일을 프로젝트 내부에(서버) 저장
                    //여기에서 실제 경로에 파일저장
                    String saveFilePath = "upload" + File.separator + "book" + File.separator + fileName;//운영체제에 맞게 파일 경로 생성하기 위한 코드
                    Path path = Paths.get(saveFilePath); //파라미터에 해당하는 파일 경로를 가져오는 Path 변수로, 해당 파일을 저장할 파일명을 포함한 경로를 의미
                    log.info("path-------------------:{}", path);
                    try {
                        //upload 디렉토리가 없는 경우 noSuchFileExcption 방지
                        Files.createDirectories(path.getParent()); // 디렉터리(폴더) 없으면 생성
                        Files.write(path, file.getBytes()); // 파일 저장
                        log.info("파일 저장 완료: {}", saveFilePath);
                    } catch (IOException e) {
                        log.error("파일 저장 실패: {}", e.getMessage());
                    }

                }
                // List<String> bookImgPath를 하나의 문자열로 변환
                log.info("bookImgPath---------------------데이터베이스에 저장할 문자열:{}", bookImgPath); // 리스트 객체
                // 객체를 또 순회해서 문자열로 만들어야함 ?????
            }else{
                //null일 떄
                bookImgPath = "기본이미지없음";
            }

            log.info(" book객체 설정 후 -------:{}" , book);
            book.setDbImgPath(bookImgPath);
            cnt = dao.createBook(book); // 처리가 되면 값이 1로 변경
            log.info("cnt------------------- : {} ", cnt);
            return cnt; // 1 반환
        }
        return cnt;
    }


}
