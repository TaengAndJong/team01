package com.example.team01.client.dao;

import org.apache.ibatis.annotations.Mapper;
import com.example.team01.vo.CreateBoardVO;

@Mapper
public interface CreateBoardDao {
  void createQnaOneBoard(CreateBoardVO createBoardVO);
  void createProductBoard(CreateBoardVO createBoardVO);
  void createDeliveryBoard(CreateBoardVO createBoardVO);
}

