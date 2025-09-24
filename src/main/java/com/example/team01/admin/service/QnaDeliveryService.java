package com.example.team01.admin.service;
import com.example.team01.vo.QnaDeliveryVO;
import com.example.team01.utils.Pagination;

import java.util.List;


public interface QnaDeliveryService {
    //                                                  클래스   참조변수
    public List<QnaDeliveryVO> getAllQnaDeliveryList(Pagination pagenation);

    // 배송 문의 상세 조회
    public QnaDeliveryVO getQnaDeliveryDetail(String boardId, String userId);

    // 배송 문의 게시물 삭제
    public int deleteDeliveryBoard(List<String> boardId);
}