package com.example.team01.admin.dao;



import com.example.team01.utils.Pagination;
import com.example.team01.vo.AdminBookVO;
import com.example.team01.vo.BookVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;


// Mybatis와 연결할 Data access Object 로 Mapper 지정 -> BooKMapper.xml 연결
//파라미터가 여러 개 일 경우, @Param 어노테이션을 사용해서 처리
@Mapper
public interface AdminBookDao {

    //도서목록
    public List<AdminBookVO> selectAllBook(@Param("pagination") Pagination pagination);
    //도서상세페이지 ( id로 특정 데이터 조회후 특정데이터 레코드 전부 반환 ==> BookVO사용)
    public AdminBookVO selectOneBook(@Param("bookId") Long bookId);

    //도서 등록 --> mybatis 삭제, 등록, 수정에 대해 int 로 반환
    public int createBook(AdminBookVO book);
    //도서 수정
    public int updateBook(AdminBookVO book);
    //도서 존재 여부 판단 ==>넘겨받은 도서아이디 파라미터 데이터베이스에서 조회
    public List<Long> existBooks(@Param("bookIds") List<Long> bookIds);
    //도서 삭제
    public int deleteBooks(@Param("existBookIds") List<Long> existBookIds);
    //xml로 여러개의 파라미터를 넘겨주려면 @Param으로 바인딩할 파라미터명을 명시해줘야 함
//    public List<BookVO> searchBook(@Param("type") String bookType,
//                                        @Param("field") String searchType,
//                                        @Param("keyword") String keyword );

    //수정시이미지가 삭제되었을 경우
    public int updateBookImgPath(@Param("bookImgPaths") List<String> bookImgPaths);

   //totalRecode
   public int totalRecord(@Param("pagination") Pagination pagination);

   //


}
