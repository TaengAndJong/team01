package com.example.backend.test.service;

import java.util.List;

import javax.inject.Inject;

import org.springframework.stereotype.Service;

import com.example.backend.test.dao.TestDao;
import com.example.backend.vo.TestVO;

//@Inject와  @Autowired
//dao 객체를 불러올 때 의존성을 주입해 직접 객체를 생성할 필요없이 사용가능하게 하며,  결합도를 낮출 수 있음.


@Service
public class TestServiceImple implements TestService{

    //dao 객체 불러오기 :  서비스 구현체에서 dao를 사용해서 비즈니스 로직을 생성해야 함 = Dao 주입, private(은닉화)
    
    @Inject
    private TestDao dao;
    
    
    //Service 인터페이스의 메소드들을 @Override를 통해 재정의하고 비즈니스로직을 생성
    //데이터를 DB에 삽입 
    @Override
    public void addTest(TestVO test) {
        dao.insetTest(test);
    }

    @Override
    public void modifyTest(TestVO test) {
        dao.updateTest(test);
    }

    @Override
    public void removeTest(String testId) {
        dao.deleteTest(testId);
    }

    @Override
    public TestVO getSelectOne(String testId) {
        return dao.selectOne(testId);
    }

    @Override
    public List<TestVO> getSelectAll() {
        return dao.selectAll();
    }
    

}
