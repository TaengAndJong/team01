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
    public int createBook(BookVO book,List<MultipartFile> bookImage) {
        int cnt = 0; // mybatis의 insert 성공해서 데이터베이스에 저장된 행의 수 반환값을 담기위한 변수,  초기화
        if(book != null) { // 도서데이터 book 객체의 값이 null이 아니면 데이터베이스에 저장하겠다!
            log.info("createBook data:{}", book );

            // 1. 파일 경로 리스트 생성
            List<String> filePaths = new ArrayList<>(); // 업로드된 파일들의 경로를 담을 리스트

            if (bookImage != null && !bookImage.isEmpty()){ //  클라이언트가 전달한 파일 목록이 null 아니고, 비어있어도 안됨
                for(MultipartFile saveFile : bookImage){ // 향상된 for문을 통해 하나로 분리

                    try{
                        // 고유한 파일명 생성 (데이터베이스에 저장될 부분)
                        String fileName= UUID.randomUUID().toString()+ "_" + saveFile.getOriginalFilename(); //업로드된 파일의 원본 이름
                        //고유한 식별자(UUID)를 추가해서 파일이름 중복 방지

                        //서버 저장 경로 (프로젝트 루트 폴더부터 시작)
                        String filePath = "/upload/book" + fileName;

                        //파일 저장(서버의 디렉토리에 파일을 저장)
                        Path path = Paths.get(filePath); //업로드된 파일을 저장할 경로를 Path 객체로 변환
                        Files.write(path,saveFile.getBytes()); // path라는 경로에 바이너리 형태로 반환된 객체를 저장

                        //파일 경로를 리스트에 추가
                        filePaths.add(filePath);

                    } catch (IOException e) {
                        e.printStackTrace(); //에러 출력
                       return 0; // 파일 저장 과정 종료
                    }

                    //
                }
                //for end
            }
            //if end

            // 2. BookVO 객체에 파일 경로 리스트 추가 ( Mapper로 넘어갈 파라미터를 미리 설정)
            book.setBookImgPath(filePaths);
            // 도서 데이터 전달
            cnt = dao.createBook(book);
           log.info("cnt data:{}", cnt );
        }
        return cnt;
    }


}
