package com.example.team01.admin.dao;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface AdminDao {
    public int getQnaOneLength();
    public int getProductLength();
    public int getDeliveryLength();
}
