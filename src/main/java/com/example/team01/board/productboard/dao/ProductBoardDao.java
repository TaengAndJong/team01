package com.example.team01.board.productboard.dao;


import org.apache.ibatis.annotations.Param;

import com.example.team01.vo.ProductBoardVO;
import java.util.List;

public interface ProductBoardDao {
    int CreateProductBoard(ProductBoardVO vo);
    List<ProductBoardVO> GetProductBoardlist(@Param("userId") String userId);
    ProductBoardVO getProductBoardDetail(@Param("boardId") String boardId,@Param("userId") String userId);
    int deleteProductBoard(@Param("boardId") String boardId);
}
