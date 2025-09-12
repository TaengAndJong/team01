package com.example.team01.productboard.service;

import com.example.team01.vo.ProductBoardVO;
import java.util.List;

public interface ProductBoardService {
    void CreateProductBoard(ProductBoardVO vo);
    List<ProductBoardVO> GetProductBoardlist(String userId);
    ProductBoardVO getProductBoardDetail(String boardId, String userId);
    int deleteProductBoard(String boardId);
}
