package com.example.team01.admin.service;
import com.example.team01.vo.QnaDeliveryVO;
import com.example.team01.utils.Pagination;

import java.util.List;


public interface QnaDeliveryService {
    //                                                  클래스   참조변수
    public List<QnaDeliveryVO> getAllQnaDeliveryList(Pagination pagenation);
}