package com.example.team01.book.service;

import com.example.team01.book.dao.BookDao;
import com.example.team01.common.exception.BookNotFoundException;
import com.example.team01.utils.FileUtils;
import com.example.team01.utils.Pagination;
import com.example.team01.vo.AdminBookVO;
import com.example.team01.vo.BookVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value; // 롬복 사용하면 안됨, inMemory에서 가져오려면 이 패키지 사용해야 함

import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;


//파일을 찾고 검증하는 로직은 비즈니스 로직,재사용성을 고려할 때도 서비스 계층이 더 적절
// Service에서만 Dao 객체 사용
@Slf4j
@RequiredArgsConstructor
@Service
public class BookServiceImple implements BookService{

    private final BookDao dao;

    @Override
    public List<BookVO> selectAllBooks() {
        log.info("selectAllBooks : {}",dao.selectAllBooks());
        //bookImgPath를 bookImgList 배열에 담아주고 setter로 BookVO에 담아주기
        List<String> bookImgList = new ArrayList<>();


        return dao.selectAllBooks();
    }

    @Override
    public BookVO selectOneBook(String bookId) {

        BookVO bookVO = dao.selectOneBook(bookId);
        log.info("selectOneBook ------bookVO: {}",bookVO);
        // 텍스트 이미지경로 to ArrayList 이미지경로
        //bookImgPath  배열로 변경해서 넣어야함
        // 텍스트 이미지 split(",") 사용해서 문자 배열로 변경
        String[] bookImgPaths = bookVO.getBookImgPath().split(",");
        log.info("bookImgPaths ------: {}",bookImgPaths);

        // bookVO의 bookImgList에 String 배열을 List 배열로 변경해 담아주기
        bookVO.setBookImgList(Arrays.asList(bookImgPaths));
        log.info("selectOneBook ------: {}",bookVO);
        //파일유틸에 경로변경

        return dao.selectOneBook(bookId);
    }


}
