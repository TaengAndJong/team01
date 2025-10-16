package com.example.team01.admin.service;

import java.util.List;

import com.example.team01.dto.admin.StockBookDTO;
import com.example.team01.utils.Pagination;

public interface AdminService {
    // 게시물 크기 받아오는 서비스
    public int getQnaOneLength();
    public int getProductLength();
    public int getDeliveryLength();

    // 재고 부족한 도서 받아오는 서비스
    public List<StockBookDTO> getStockDomesticBooks(Pagination pagination);
    public List<StockBookDTO> getStockForeignBooks(Pagination pagination);
    public List<StockBookDTO> getStockEBooks(Pagination pagination);
}
