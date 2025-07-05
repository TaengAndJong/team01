package com.example.team01.attachment.dao;

import org.apache.ibatis.annotations.Mapper;
import com.example.team01.vo.AttachmentVO;
@Mapper
public interface AttachmentDao {
    void InsertAttachment_ID(AttachmentVO vo);
}
