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
        
        String bookImgPath="";
        int cnt =0;
        if(book != null) {
            log.info("createBook에 파일 객체도 담겨서 넘어옴:{}", book );
            log.info("book.file?????:{}", book.getBookImgPath()); // 1개 이상의 파일

            if(!book.getBookImgPath().isEmpty()) {
                for (MultipartFile file : book.getBookImgPath()) {
                    String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename(); //랜덤 파일 명칭(중복방지)
                    log.info("fileName:{}", fileName);

                    if(!bookImgPath.equals("")) {
                        bookImgPath= bookImgPath +","+fileName;
                    }else{
                        bookImgPath = fileName;
                    }
                    //실제파일을 프로젝트 내부에(서버) 저장
                    Path path = Paths.get(bookImgPath);
                    log.info("bookImgPath-------------------:{}", path);
                }
                // List<String> bookImgPath를 하나의 문자열로 변환
                log.info("bookImgPath---------------------:{}", bookImgPath); // 리스트 객체
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
