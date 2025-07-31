package com.example.team01.attachment.dao;

import org.apache.ibatis.annotations.Mapper;
import com.example.team01.vo.AttachmentVO;
import java.util.List;

@Mapper
public interface AttachmentDao {
    void InsertAttachment_ID(AttachmentVO vo);
    List<AttachmentVO> GetAttachmentList(String userId , String boardType);
}
