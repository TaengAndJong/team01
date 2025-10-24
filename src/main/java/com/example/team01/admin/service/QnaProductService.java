package com.example.team01.admin.service;
import com.example.team01.vo.QnaProductVO;
import com.example.team01.utils.Pagination;
import java.util.List;

public interface QnaProductService {
    public List<QnaProductVO> getAllQnaProductList(Pagination pagination , String userId);

    // 상품 문의 상세 조회
    public QnaProductVO getQnaProductDetail(String boardId, String userId);

    // 상품 문의 게시물 삭제
    public int deleteProductBoard(List<String> boardId);

    // 상품 문의 게시물 답변여부 수정
    public int updateQnaProductStatus(String boardId);
}