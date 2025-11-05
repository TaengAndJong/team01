package com.example.team01.admin.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

import org.springframework.stereotype.Service;
import com.example.team01.admin.dao.AdminDao;
import com.example.team01.dto.admin.ChartDataDTO;
import com.example.team01.dto.admin.NewBookDTO;
import com.example.team01.dto.admin.StockBookDTO;
import com.example.team01.dto.book.BookDTO;
import com.example.team01.dto.cart.CartDTO;
import com.example.team01.utils.Pagination;
import com.example.team01.vo.BookVO;
import com.example.team01.vo.CartVO;

import jakarta.transaction.Transactional;

@Slf4j
@Transactional
@RequiredArgsConstructor
@Service
public class AdminServiceImple implements AdminService {
    
    private final AdminDao dao ;

    // 신규 등록 문의 게시물 로직
    @Override
    public int getQnaOneLength() {
        int result = dao.getQnaOneLength();
        return result;
    }

    @Override
    public int getProductLength() {
        int result = dao.getProductLength();
        return result;
    }

    @Override
    public int getDeliveryLength() {
        int result = dao.getDeliveryLength();
        return result;
    }

    // 신규 도서 로직
    @Override
    public List<NewBookDTO> getNewDomesticBooks(Pagination pagination){
        int total = dao.countNewDomesticBooks();
        pagination.setTotalRecord(total);
        pagination.setLimitRows(pagination.getCurrentPage());

        List<BookVO> bookVOList = dao.getNewDomesticBooks(pagination);
        
        List<NewBookDTO> newBookList = bookVOList.stream()
                .map(this::convertToNewDTO)
                .toList();
                
        return newBookList;
    }

    @Override
    public List<NewBookDTO> getNewForeignBooks(Pagination pagination){
        int total = dao.countNewForeignBooks();
        pagination.setTotalRecord(total);
        pagination.setLimitRows(pagination.getCurrentPage());

        List<BookVO> bookVOList = dao.getNewForeignBooks(pagination);
        
        List<NewBookDTO> newBookList = bookVOList.stream()
                .map(this::convertToNewDTO)
                .toList();
                
        return newBookList;
    }
    @Override
    public List<NewBookDTO> getNewEBooks(Pagination pagination){
        int total = dao.countNewEBooks();
        pagination.setTotalRecord(total);
        pagination.setLimitRows(pagination.getCurrentPage());

        List<BookVO> bookVOList = dao.getNewEBooks(pagination);
        
        List<NewBookDTO> newBookList = bookVOList.stream()
                .map(this::convertToNewDTO)
                .toList();
                
        return newBookList;
    }

    // 재고 부족 도서 로직
    @Override
    public List<StockBookDTO> getStockDomesticBooks(Pagination pagination){
            log.info("[Service] 국내도서 before count - currentPage={}, pageSize={}",
            pagination.getCurrentPage(), pagination.getPageSize());
        
        int total = dao.countStockDomesticBooks();
        pagination.setTotalRecord(total);
        pagination.setLimitRows(pagination.getCurrentPage());

        log.info("[Service] 국내도서 after setLimitRows - total={}, startRow={}, endRow={}",
            total, pagination.getStartRow(), pagination.getEndRow());

        List<BookVO> bookVOList = dao.getStockDomesticBooks(pagination);
        
        List<StockBookDTO> stockBookList = bookVOList.stream()
                .map(this::convertToStockDTO)
                .toList();
        
        return stockBookList;
    }

    @Override
    public List<StockBookDTO> getStockForeignBooks(Pagination pagination){
        
        

        int total = dao.countStockForeignBooks();
        pagination.setTotalRecord(total);
        pagination.setLimitRows(pagination.getCurrentPage());

                log.info("[Service] 국외도서 after setLimitRows - total={}, startRow={}, endRow={}",
            total, pagination.getStartRow(), pagination.getEndRow());

        List<BookVO> bookVOList = dao.getStockForeignBooks(pagination);
        
        List<StockBookDTO> stockBookList = bookVOList.stream()
                .map(this::convertToStockDTO)
                .toList();
        
        return stockBookList;
    }

    @Override
    public List<StockBookDTO> getStockEBooks(Pagination pagination){
        
        

        int total = dao.countStockEBooks();
        pagination.setTotalRecord(total);
        pagination.setLimitRows(pagination.getCurrentPage());
        log.info("[Service] EBOOK after setLimitRows - total={}, startRow={}, endRow={}",
            total, pagination.getStartRow(), pagination.getEndRow());
        List<BookVO> bookVOList = dao.getStockEBooks(pagination);
        
        List<StockBookDTO> stockBookList = bookVOList.stream()
                .map(this::convertToStockDTO)
                .toList();
        


        return stockBookList;
    }

    private StockBookDTO convertToStockDTO(BookVO vo) {
        log.info("convertToStockDTO--------vo:{}",vo);

        return StockBookDTO.builder()
                .bookId(vo.getBookId())
                .bookName(vo.getBookName())
                .bookCateNm(vo.getBookCateNm())
                .author(vo.getAuthor())
                .stock(vo.getStock())
                .stockStatus(vo.getStock() > 0 ? "재고 있음" : "품절")
                .publishDate(vo.getPublishDate())
                .build();
        }

    private NewBookDTO convertToNewDTO(BookVO vo) {
        log.info("convertToNewDTO--------vo:{}",vo);

        return NewBookDTO.builder()
                .bookId(vo.getBookId())
                .bookName(vo.getBookName())
                .bookCateNm(vo.getBookCateNm())
                .author(vo.getAuthor())
                .publishDate(vo.getPublishDate())
                .stockStatus(vo.getStock() > 0 ? "재고 있음" : "품절")
                .build();
        }


        @Override
    public List<ChartDataDTO> getVisitPageViewCount(String startDate, String endDate){
        log.info("startDate :{}, endDate: {}",startDate, endDate);

        List<ChartDataDTO> result = dao.selectVisitPageViewCount(startDate, endDate);
        log.info("차트 데이터 result : {}",result);
        return null;
    }
    };

