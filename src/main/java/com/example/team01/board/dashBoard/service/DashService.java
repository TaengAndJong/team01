package com.example.team01.board.dashBoard.service;

public interface DashService {

    //3개월 이내 찜목록 건수 조회
    public int selectBoardCnt(String clientId);
}
