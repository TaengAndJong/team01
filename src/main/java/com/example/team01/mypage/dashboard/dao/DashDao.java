package com.example.team01.board.dashboard.dao;

import com.example.team01.board.dashboard.dto.ResponseQnaCntDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface DashDao {

    public ResponseQnaCntDTO selectBoardCnt(@Param("clientId") String clientId);

}
