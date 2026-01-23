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

        Map<String,Object> partialBooks= booksMap(books);

        //books를 순회하면서 국내,국외, EBOOK으로 데이터 나누기
        return partialBooks;
    }

    
    
    //books 도서 데이터 나눌 메서드
    public Map<String,Object> booksMap(List<BookVO> books) {

        // 메인 도서슬라이드 담을 맵 객체 (normalType의 도서들)
        Map<String, List<BookVO>> bookSlide = new HashMap<>();
        //추천도서
        List<BookVO> recomSlide = new ArrayList<>();
        //인기도서
        List<BookVO> popularSlide = new ArrayList<>();


        // 카테고리를 나눠서 빈 배열객체로 미리 초기값 설정하기 ( null 방지 )
        bookSlide.put("ebook",new ArrayList<>());
        bookSlide.put("national",new ArrayList<>());
        bookSlide.put("foreigner",new ArrayList<>());


        //books를 순회하면서 cateId EBOOK,국내도서, 국외도서 있을 경우
        for (BookVO book : books) {


            /*
                기존 분기 변수 ==> 의미를 여러개 담고 있어서 정규화 위배, 인덱스 못탐, 성능 저하 문제
                String cate = book.getBookCateNm().trim().toUpperCase();
            */

            String cateId = book.getCateId();  // 디비에 카테고리 분기 기준
            String recomType = book.getRecomType();// 도서 추천타입 분류 변수
            book.setDetailUrl("/book/bookDetail/" + book.getBookId()); // 도서상품에 연결할  URL 세팅(가공)


//            log.info("전자도서 cateId : ",cateId);
            //일반도서 --> 메인슬라이드
            if (RecomStatus.NORMAL.matches(recomType)) {
               // log.info("NORMAL cateId E: {} recomType :{} ",cateId, recomType);
                if (cateId.startsWith("E")) {

                    bookSlide.get("ebook").add(book);
                } else if (cateId.startsWith("N")) {
                 //   log.info("NORMAL cateId N: {} ,recomType :{}",cateId,recomType);
                    bookSlide.get("national").add(book);
                } else if (cateId.startsWith("F")) {
                 //   log.info("NORMAL cateId F: {} ,recomType :{}",cateId,recomType);
                    bookSlide.get("foreigner").add(book);
                }
            }
    
            //추천도서 
            if (RecomStatus.RECOMMEND.matches(recomType)) {
               // log.info(" recomSlide RecomStatus: ",recomType);
                recomSlide.add(book);
                
            }
            //인기도서
            if (RecomStatus.POPULAR.matches(recomType)) {
              //  log.info(" POPULAR RecomStatus: ",recomType);
                popularSlide.add(book);

            }


        }



        //최종 반환할 객체
        Map<String,Object> result = new HashMap<>();

        result.put("bookSlide",bookSlide); //Map<String , List<BookVO>>
        result.put("recomSlide",recomSlide);//List<BookVO>
        result.put("popularSlide",popularSlide);//List<BookVO>

        return result;
    }
}
