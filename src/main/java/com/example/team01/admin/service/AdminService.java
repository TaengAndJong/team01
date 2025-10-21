package com.example.team01.admin.service;

import java.util.List;

import com.example.team01.dto.admin.StockBookDTO;
import com.example.team01.dto.admin.NewBookDTO;
import com.example.team01.utils.Pagination;

public interface AdminService {
    // 게시물 크기 받아오는 서비스 (일주일 기준)
    public int getQnaOneLength();
    public int getProductLength();
    public int getDeliveryLength();

    // 신규 등록 도서 받아오는 서비스 (일주일 기준)
    public List<NewBookDTO> getNewDomesticBooks(Pagination pagination);
    public List<NewBookDTO> getNewForeignBooks(Pagination pagination);
    public List<NewBookDTO> getNewEBooks(Pagination pagination);

    // 재고 부족한 도서 받아오는 서비스
    public List<StockBookDTO> getStockDomesticBooks(Pagination pagination);
    public List<StockBookDTO> getStockForeignBooks(Pagination pagination);
    public List<StockBookDTO> getStockEBooks(Pagination pagination);
}
