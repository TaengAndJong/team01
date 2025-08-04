package com.example.team01.admin.service;
import com.example.team01.vo.QnaProductVO;
import com.example.team01.utils.Pagination;

import java.util.List;

public interface QnaProductService {
    public List<QnaProductVO> getAllQnaProductList(Pagination pagenation);
}