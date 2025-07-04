package com.example.team01.attachment.service;

import org.springframework.stereotype.Service;
import com.example.team01.vo.AttachmentVO;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@Service
public interface AttachmentService {
    public List<String> insertAttachmentService(AttachmentVO attachmentVO);
}
