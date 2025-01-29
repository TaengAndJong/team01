package com.example.team01.book.dao;


import com.example.team01.vo.BookVO;
import org.apache.ibatis.annotations.Mapper;


// Mybatis와 연결할 Data access Object 로 Mapper 지정 -> BooKMapper.xml 연결

@Mapper
public interface BookDao {

    //도서목록
    public BookVO selectAllBook();
    //도서상세페이지 ( id로 특정 데이터 조회후 특정데이터 레코드 전부 반환 ==> BookVO사용)
    public BookVO selectOneBook(String bookId);

    //도서 등록 --> mybatis 삭제, 등록, 수정에 대해 int 로 반환
    public int createBook(BookVO bookVO);
    //도서 수정
    public int modifyOneBook(BookVO book);
    //도서 삭제
    public int deleteOneBook(String bookId);

    //
}
