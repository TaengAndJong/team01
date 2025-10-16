package com.example.team01.admin.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

import org.springframework.stereotype.Service;
import com.example.team01.admin.dao.AdminDao;
import com.example.team01.dto.admin.StockBookDTO;
import com.example.team01.dto.book.BookDTO;
import com.example.team01.dto.cart.CartDTO;
import com.example.team01.utils.Pagination;
import com.example.team01.vo.BookVO;
import com.example.team01.vo.CartVO;

@Slf4j
@RequiredArgsConstructor
@Service
public class AdminServiceImple implements AdminService {
    
    private final AdminDao dao ;

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


    @Override
    public List<StockBookDTO> getStockEBooks(Pagination pagination){
        
        

        int total = dao.countStockEBooks();
        pagination.setTotalRecord(total);
        pagination.setLimitRows(pagination.getCurrentPage());

        List<BookVO> bookVOList = dao.getStockEBooks(pagination);
        
        List<StockBookDTO> stockBookList = bookVOList.stream()
                .map(this::convertToDTO)
                .toList();
        
        return stockBookList;
    }

    private StockBookDTO convertToDTO(BookVO vo) {
        log.info("convertToDTO--------vo:{}",vo);

        return StockBookDTO.builder()
                .bookId(vo.getBookId())
                .bookName(vo.getBookName())
                .bookCateNm(vo.getBookCateNm())
                .author(vo.getAuthor())
                .stock(vo.getStock())
                .stockStatus(vo.getStock() > 0 ? "재고 있음" : "품절")
                .build();
        }

    };

