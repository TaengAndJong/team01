package com.example.team01.common.service;


import com.example.team01.vo.ClientVO;

public interface ClientService {

    public ClientVO getClientWithRole(String clientId);

    public ClientVO selectOneStaff(String staffId, String staffName,String staffBirth) ;

    public int selectDuplicateClientStaff(String staffId);
}
