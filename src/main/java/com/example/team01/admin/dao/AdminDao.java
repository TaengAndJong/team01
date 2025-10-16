package com.example.team01.admin.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.team01.dto.admin.StockBookDTO;
import com.example.team01.utils.Pagination;
import com.example.team01.vo.BookVO;

@Mapper
public interface AdminDao {
    public int getQnaOneLength();
    public int getProductLength();
    public int getDeliveryLength();
    

    public int countStockEBooks();
    public List<BookVO> getStockEBooks(@Param("pagination") Pagination pagination);
}
