package com.example.team01.index.service;

import com.example.team01.book.service.BookService;
import com.example.team01.index.dao.MainDao;
import com.example.team01.vo.BookVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@Service
public class MainServiceImple implements MainService {

    private final MainDao dao;


    @Override
    public Map<String,List<BookVO>> getPartOfBooks() {
        // row_number() 윈도우 함수와 over() 절의 partition By를 사용하여 각 도서의 카테고리별 8개순위까지 제한
        List<BookVO> books = dao.selectBooks();
        log.info("getPartOfBooks :{}",books);
        Map<String,List<BookVO>> partialBooks= booksMap(books);
        log.info("partialBooks :{}",partialBooks);
        //books를 순회하면서 국내,국외, EBOOK으로 데이터 나누기
        return partialBooks;
    }
    
    
    
    //books 도서 데이터 나눌 메서드
    public Map<String,List<BookVO>> booksMap(List<BookVO> books) {
        log.info("booksMap :{}",books);
        // 최종 결과를 담을 Map 객체
        Map<String, List<BookVO>> result = new HashMap<>();

        List<BookVO> ebook = new ArrayList<>();
        List<BookVO> national = new ArrayList<>();
        List<BookVO> foreigner = new ArrayList<>();

        //books를 순회하면서 bookCateNm에 EBOOK,국내도서, 국외도서 있을 경우
        for (BookVO book : books) {
            String cate = book.getBookCateNm();
            book.setDetailUrl("/book/bookDetail/" + book.getBookId());

            //bookCateNm 의 데이터가 "국내도서,로맨스,..." 등의 문자열이기 때문에 contains 메서드를 사용해서 글자가 포함되어잇는지 확인
            if (cate.contains("EBOOK")) {
                ebook.add(book);
            } else if (cate.contains("국내도서")) {
                national.add(book);
            } else if (cate.contains("국외도서")) {
                foreigner.add(book);
            }
        }
        //각각의 배열에 담아서
        result.put("ebook",ebook);
        result.put("national",national);
        result.put("foreigner",foreigner);
        //하나의 map객체에 담아서 반환
        
        return result;
    }
}
