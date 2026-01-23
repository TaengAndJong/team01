package com.example.team01.book.service;

import com.example.team01.book.dao.BookDao;
import com.example.team01.utils.Pagination;
import com.example.team01.vo.BookVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;


//파일을 찾고 검증하는 로직은 비즈니스 로직,재사용성을 고려할 때도 서비스 계층이 더 적절
// Service에서만 Dao 객체 사용
@Slf4j
@Transactional
@RequiredArgsConstructor
@Service
public class BookServiceImple implements BookService{

    private final BookDao dao;

    @Override
    public List<BookVO> selectAllBooks(Pagination pagination) {
        //전체 데이터 레코드 조회해오기
        int total = dao.totalRecord(pagination);

        // 전체 데이터 페이지네이션 멤버변수 값 설정
        pagination.setTotalRecord(total);
        log.info("서비스 pagination 총 레코드 수 -----------:{}", pagination.getTotalRecord());
        log.info("서비스 pagination 총 getCurrentPage 수 -----------:{}", pagination.getCurrentPage());
        //startRow && endRow 설정
        pagination.setLimitRows();
        log.info("컨트롤러에서 받아온 파라미터 pagination2222:{}", pagination.toString());

        log.info("selectAllBooks : {}",dao.selectAllBooks(pagination));
        //bookImgPath를 bookImgList 배열에 담아주고 setter로 BookVO에 담아주기
        // 조회된 전체 데이터의 행의 개수 조회
        List<BookVO> bookVOList = dao.selectAllBooks(pagination);

        //실제이미지 파일 클라이언트로 전송하는 로직
        //1.데이터베이스에서 도서 객체 조회
        for(BookVO bookVO : bookVOList){
            //한 행의 레코드 하나씩 조회

            //2. bookImgPath "," 기준으로 자르고 배열반환
            String[] getBookImg= bookVO.getBookImgPath().split(",");

            /// 여기에서 bookVO객체 배열로변경해서 설정해야하는뎅
            bookVO.setBookImgList(Arrays.asList(getBookImg));
        }//end

        //5. 전체 객체 반환하기
        return bookVOList;
    }

    @Override
    public BookVO selectOneBook(Long bookId) {

        BookVO bookVO = dao.selectOneBook(bookId);

        // 텍스트 이미지경로 to ArrayList 이미지경로
        //bookImgPath  배열로 변경해서 넣어야함
        // 텍스트 이미지 split(",") 사용해서 문자 배열로 변경
        String[] bookImgPaths = bookVO.getBookImgPath().split(",");
        // bookVO의 bookImgList에 String 배열을 List 배열로 변경해 담아주기
        bookVO.setBookImgList(Arrays.asList(bookImgPaths));

        //파일유틸에 경로변경

        return dao.selectOneBook(bookId);
    }


}
