package com.example.team01.mypage.userInfo.dao;

import com.example.team01.vo.ClientVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserInfoDao {

     ClientVO selectClientInfo(@Param("clientId") String clientId, @Param("roleId") String roleId);

}
