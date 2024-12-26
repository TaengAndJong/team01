package com.example.team01.pages.service;

import com.example.team01.pages.dao.PageDao;
import com.example.team01.vo.PageVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;


import java.util.List;

@Slf4j
@RequiredArgsConstructor // final 선언시 생성자 주입 요구 어노테이션
@Service
public class PageServiceImple implements PageService {

    private final PageDao dao;
    //final을 선언하면 생성자 주입방식을 요구함 , final 필드는 한 번 값이 할당되면 수정할 수 없기 때문에, 스프링에서 자동으로 생성자 주입을 통해 주입할 수 있도록 해야 합니다

    @Override
    public PageVO pageOne(String pageId){

        PageVO pageVO = dao.selectOne(pageId);
        log.info("pageVO: {}", pageVO);
        return pageVO;
    }

    @Override
    public List<PageVO> pageList(){
        List<PageVO> pageList = dao.selectAllPage();

        if (pageList == null || pageList.isEmpty()) {
            PageVO defaultVO = new PageVO("defaultId", "No data available","nodata");
            return List.of(defaultVO); // 기본값이 포함된 리스트 반환
        }

        return pageList;
    }

    @Override
    public int insert(PageVO pageVO) {
        int cnt;
        if (pageVO != null) {
            return cnt = dao.insert(pageVO);
        }
        return 0;
    }


}
