package com.example.team01.board.dashBoard.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface DashDao {

    public int selectBoardCnt(@Param("clientId") String clientId);
}
