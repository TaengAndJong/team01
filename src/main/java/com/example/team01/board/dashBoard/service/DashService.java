package com.example.team01.board.dashboard.service;

import com.example.team01.board.dashboard.dto.ResponseQnaCntDTO;

public interface DashService {

    //3개월 이내 찜목록 건수 조회
    public ResponseQnaCntDTO selectBoardCnt(String clientId);
}
