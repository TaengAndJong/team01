package com.example.team01.productboard.dao;

import com.example.team01.vo.ProductBoardVO;
import java.util.List;

public interface ProductBoardDao {
    void CreateProductBoard(ProductBoardVO vo);
    List<ProductBoardVO> GetProductBoardlist(String userId);
    ProductBoardVO getProductBoardDetail(String boardId, String userId);
    int deleteProductBoard(String boardId);
}
