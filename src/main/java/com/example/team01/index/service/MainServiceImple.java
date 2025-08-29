package com.example.team01.index.service;

import com.example.team01.book.service.BookService;
import com.example.team01.common.Enum.RecomStatus;
import com.example.team01.index.dao.MainDao;
import com.example.team01.vo.BookVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@RequiredArgsConstructor
@Service
public class MainServiceImple implements MainService {

    private final MainDao dao;


    @Override
    public Map<String,Object> getPartOfBooks() {
        // row_number() 윈도우 함수와 over() 절의 partition By를 사용하여 각 도서의 카테고리별 8개순위까지 제한
        List<BookVO> books = dao.selectBooks();
        log.info("getPartOfBooks---------------- 도서 recomType으로 분류 필요 :{}",books);
        Map<String,Object> partialBooks= booksMap(books);
        log.info("partialBooks :{}",partialBooks);
        //books를 순회하면서 국내,국외, EBOOK으로 데이터 나누기
        return partialBooks;
    }

    
    
    //books 도서 데이터 나눌 메서드
    public Map<String,Object> booksMap(List<BookVO> books) {
        log.info("booksMap :{}",books);
        // 메인 도서슬라이드 담을 맵 객체 (normalType의 도서들)
        Map<String, List<BookVO>> bookSlide = new HashMap<>();
        //추천도서
        List<BookVO> recomSlide = new ArrayList<>();
        //인기도서
        List<BookVO> popularSlide = new ArrayList<>();


        // 카테고리를 나눠서 빈 배열객체로 미리 초기값 설정하기
        bookSlide.put("ebook",new ArrayList<>());
        bookSlide.put("national",new ArrayList<>());
        bookSlide.put("foreigner",new ArrayList<>());


        //books를 순회하면서 bookCateNm에 EBOOK,국내도서, 국외도서 있을 경우
        for (BookVO book : books) {
            log.info("book : 서비스 구현체 순회");
            log.info("book :{}",book);

            String cate = book.getBookCateNm().trim().toUpperCase();
            String recomType = book.getRecomType();
            book.setDetailUrl("/book/bookDetail/" + book.getBookId());

            if(RecomStatus.NORMAL.getRecomType().equals(recomType)){
                log.info("recomType Normal-------------:{}",recomType);
                log.info("recomType cate-------------:{}",cate);

                if ("EBOOK".equalsIgnoreCase(cate)) {
                    bookSlide.get("ebook").add(book);
                } else if ("국내도서".equals(cate)) {
                    bookSlide.get("national").add(book);
                } else if ("국외도서".equals(cate)) {
                    // else로 하면 국외도서 이외의 값이 들어갈 수 있기때문에 else if로 사용해 처리
                    bookSlide.get("foreigner").add(book);
                }

            }else if(RecomStatus.RECOMMEND.getRecomType().equals(recomType)){
                log.info("추천 슬라이드");
                recomSlide.add(book);
            }else{
                log.info("인기 슬라이드");
                popularSlide.add(book);
            }

        }

        log.info("bookSlide-----순회해서 담아줌 :{}",bookSlide);
        log.info("popularSlide-----순회해서 담아줌 :{}",popularSlide);
        log.info("recomSlide-----순회해서 담아줌 :{}",recomSlide);

        //최종 반환할 객체
        Map<String,Object> result = new HashMap<>();

        result.put("bookSlide",bookSlide); //Map<String , List<BookVO>>
        result.put("recomSlide",recomSlide);//List<BookVO>
        result.put("popularSlide",popularSlide);//List<BookVO>
        log.info("result-----------------",result);
        return result;
    }
}
