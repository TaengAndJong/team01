package com.example.team01.attachment.service;

import org.springframework.stereotype.Service;
import com.example.team01.vo.AttachmentVO;
import java.util.List;
import java.time.LocalDateTime;

@Service
public interface AttachmentService {
    public List<String> insertAttachmentService(AttachmentVO attachmentVO);
    public List<AttachmentVO> GetAttachmentList(String userId,  String boardType, LocalDateTime boardDate);
}
