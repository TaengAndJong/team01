package com.example.team01.mypage.dashboard.dao;

import com.example.team01.mypage.dashboard.dto.ResponseQnaCntDTO;
import com.example.team01.mypage.dashboard.dto.ResponseQnaCntDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface DashDao {

     ResponseQnaCntDTO selectBoardCnt(@Param("clientId") String clientId);

}
