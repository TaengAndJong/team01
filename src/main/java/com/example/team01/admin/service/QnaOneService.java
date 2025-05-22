package com.example.team01.admin.service;
import com.example.team01.vo.QnaOneVO;
import com.example.team01.utils.Pagination;

import java.util.List;


public interface QnaOneService {

    public List<QnaOneVO> getAllQnaOneData(Pagination pagenation);
}
