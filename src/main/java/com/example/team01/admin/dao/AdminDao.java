package com.example.team01.admin.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.team01.utils.Pagination;
import com.example.team01.vo.BookVO;

@Mapper
public interface AdminDao {
    // 신규 등록 문의
    public int getQnaOneLength();
    public int getProductLength();
    public int getDeliveryLength();
    
    // 신규 등록 도서
    public int countNewDomesticBooks();
    public List<BookVO> getNewDomesticBooks(@Param("pagination") Pagination pagination);

    public int countNewForeignBooks();
    public List<BookVO> getNewForeignBooks(@Param("pagination") Pagination pagination);

    public int countNewEBooks();
    public List<BookVO> getNewEBooks(@Param("pagination") Pagination pagination);

    // 재고 부족 도서
    public int countStockDomesticBooks();
    public List<BookVO> getStockDomesticBooks(@Param("pagination") Pagination pagination);

    public int countStockForeignBooks();
    public List<BookVO> getStockForeignBooks(@Param("pagination") Pagination pagination);

    public int countStockEBooks();
    public List<BookVO> getStockEBooks(@Param("pagination") Pagination pagination);
}
