package com.example.team01.admin.dao;

import com.example.team01.utils.Pagination;
import com.example.team01.vo.AdminBookVO;
import com.example.team01.vo.QnaOneVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface QnaOneDao {

//    public List<QnaOneVO> allQnaDataList (); // 사용자 id에 해당하는 게시글 전체를 보내 줌

    public List<QnaOneVO> getAllQnaOneList(@Param("pagination") Pagination pagination);

    int totalRecord(@Param("pagination") Pagination pagination);
}
