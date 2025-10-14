package com.example.team01.config.listener;


import jakarta.servlet.http.HttpSessionEvent;
import jakarta.servlet.http.HttpSessionListener;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/*
* dependency  ==> lombok, spring-boot-starter-web 필요
* 
* 세션생성, 만료 체크는 서버사이드에서만 작동하기때문에 
* 클라이언트에서 요청이 들어오지않는 이상 클라이언트는 갱신이 안되며 
* 요청이 들어왔을 경우 서버(사이드)에서는 401 상태코드를 보내 클라이언트에서 처리할 수 있게 해야함
* 
* 1) 클라이언트에서 401상태 코드 인터셉터하거나  
* 2) setInterval 메서드를 사용해 일정시간마다 세션 만료 체크 요청을 보내 서버와 응답을 주고받아 확인해야함
* */


@Slf4j
@Component //스프링이 자동으로 Bean 등록해서 동작
public class SessionLogger implements HttpSessionListener { //HttpSessionListener 세션 생성/파기 이벤트를 감지하는 인터페이스
    //시큐리티 세션 만료 확인 클래스
    @Override
    public void sessionCreated(HttpSessionEvent se) {
        log.info("세션 생성됨: {}", se.getSession().getId());
    }

    @Override
    public void sessionDestroyed(HttpSessionEvent se) {
        log.info("세션 만료됨: {}", se.getSession().getId());
    }

}
