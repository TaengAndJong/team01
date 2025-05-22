package com.example.team01.admin.service;
import com.example.team01.vo.QnaOneVO;
import com.example.team01.utils.Pagination;

import java.util.List;


public interface QnaOneService {
    //                                        클래스   참조변수
    public List<QnaOneVO> getAllQnaOneList(Pagination pagenation);
}
