package com.example.team01.common.dao;

import com.example.team01.vo.ClientVO;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface ClientDao {

    // 사용자 리스트 전체
    public List<ClientVO> selectClientList();
    // 한명의 사용자 조회
    public ClientVO selectOneClient(String clientId);

    //클라이언트 Id에 따른 클라이언트정보와 Role 동시조회
    public ClientVO getClientWithRole(String clientId);


}
