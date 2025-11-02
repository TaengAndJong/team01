package com.example.team01.common.dao;

import org.apache.ibatis.annotations.Mapper;
import com.example.team01.dto.common.VisitRequestDTO;

@Mapper
public interface VisitCountDao {
    public int insertVisitLog(VisitRequestDTO dto);
}
