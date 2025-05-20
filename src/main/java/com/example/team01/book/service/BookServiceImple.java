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
        return dao.selectAllBooks();
    }


}
