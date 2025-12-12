package com.example.team01.book.dao;



import com.example.team01.utils.Pagination;
import com.example.team01.vo.AdminBookVO;
import com.example.team01.vo.BookVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;


// Mybatis와 연결할 Data access Object 로 Mapper 지정 -> BooKMapper.xml 연결
//파라미터가 여러 개 일 경우, @Param 어노테이션을 사용해서 처리
@Mapper
public interface BookDao {

 public List<BookVO> selectAllBooks(@Param("pagination") Pagination pagination);
 //도서상세페이지 ( id로 특정 데이터 조회후 특정데이터 레코드 전부 반환 ==> BookVO사용)
 public BookVO selectOneBook(Long bookId);

 //totalRecode
 public int totalRecord(@Param("pagination") Pagination pagination); // 페이지의 총 개수

 public int increaseBookQuantity(@Param("bookId") Long bookId,@Param("quantity") int quantity);
 public int decreaseBookQuantity(@Param("bookId") Long bookId,@Param("quantity") int quantity);

 //도서 존재유무와 재고확인필요
 public int checkBookCount(@Param("bookId") Long bookId);

}
