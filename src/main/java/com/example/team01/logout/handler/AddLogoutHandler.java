package com.example.team01.logout.handler;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class AddLogoutHandler implements LogoutHandler {
    // 3. 세션 무효화 , 쿠기 삭제 처리할 로그아웃 핸들러
    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
            log.info("logout AddLogout----:");

        // false로 호출하면 세션이 없으면 새로 만들지 않음
        // ==> 로그아웃 후 세션이 삭제되었을 때,  request.getSession()이  null 반환 ==>  세션 존재 유무 확인 필요
        HttpSession session = request.getSession(false);

        // 세션 무효화 처리
        if (session != null) {
            session.invalidate();  // 세션 무효화
            log.info("session.invalidate()------------------");
        }

        // JSESSIONID 쿠키 삭제
        Cookie jsessionCookie = new Cookie("JSESSIONID", null);
        jsessionCookie.setMaxAge(0);
        jsessionCookie.setPath("/");
        response.addCookie(jsessionCookie);

        log.info("JSESSIONID cookie cleared.");

        // SecurityContextHolder에 저장된 인증 정보 삭제
        SecurityContextHolder.clearContext();  // 인증 정보 삭제
        log.info("SecurityContextHolder cleared.-----------END");

    }

    //
}
