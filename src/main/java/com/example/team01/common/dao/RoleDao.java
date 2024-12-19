package com.example.team01.common.dao;


import com.example.team01.vo.RoleVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface RoleDao {
    
    // 역할의 ID와 명칭 조회
    public List<RoleVO> selectRoleList();
    //관리자 역할조회
    public RoleVO selectAdminRole(String roleId);
    //일반회원 역할 조회
    public RoleVO selectClientRole(String roleId);
    //팀원 역할 조회
    public RoleVO selectMemberRole(String roleId);
}
