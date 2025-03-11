package com.example.team01.book.service;

import com.example.team01.book.dao.BookDao;
import com.example.team01.utils.FileUtils;
import com.example.team01.vo.BookVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Value; // 롬복 사용하면 안됨, inMemory에서 가져오려면 이 패키지 사용해야 함
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;


//파일을 찾고 검증하는 로직은 비즈니스 로직,재사용성을 고려할 때도 서비스 계층이 더 적절

@Slf4j
@RequiredArgsConstructor
@Service
public class BookServiceImple implements BookService{

    private final BookDao dao;
    @Autowired
    private FileUtils fileUtils; // FileUtils를 주입

    @Override
    public List<BookVO> getAllBooks() {

        //실제이미지 파일 클라이언트로 전송하는 로직
        //1.데이터베이스에서 도서 객체 조회 
        //2. bookImgPath 에 대한 'UUID'를 '_'를 기준으로 실제파일명으로 분류
        //3.bookImgPath의 값으로 설정 후 (setter 사용) 
        //4.반환하기
        return dao.selectAllBook();
    }

    @Override
    public int createBook(BookVO book) {

        String bookImgPath=""; // 데이터베이스에 담을 파일명 담는 문자열 변수
        int cnt =0;
        if(book != null) {
            log.info("createBook에 파일 객체도 담겨서 넘어옴:{}", book );
            log.info("book.file?????:{}", book.getBookImgPath()); // 1개 이상의 파일 객체 (파일 날데이터)
            bookImgPath = fileUtils.saveFile(book.getBookImgPath(),"book");

            log.info("bookImgPath--------------------- 파일 유틸 반환값 확인: {}",bookImgPath);
           // log.info(" book객체 설정 후 -------:{}" , book);
            book.setDbImgPath(bookImgPath); // 데이터베이스에 전달할 bookImgPath 문자열 객체설정
            cnt = dao.createBook(book); // 처리가 되면 값이 1로 변경
            log.info("cnt------------------- : {} ", cnt);
            return cnt; // 1 반환
        }
        return cnt;
    }


}
