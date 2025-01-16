package com.example.team01.logout.handler;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class AddLogoutHandler implements LogoutHandler {
    // 3. 세션 무효화 처리할 로그아웃 핸들러
    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {

        // 로그아웃 사용자의 정보를 로그에 남김
        if (authentication != null) {
            String username = authentication.getName();
            log.info("사용자 '{}' 가 로그아웃했습니다.", username); // 로그 기록
        }

        // 세션 무효화 처리
        if (request.getSession(false) != null) {
            request.getSession().invalidate();
            log.info("세션이 무효화되었습니다.", request.getSession()); // 로그 기록

        }

        // 쿠키 삭제
        Cookie cookie = new Cookie("JSESSIONID", null);
        cookie.setPath("/"); // 쿠키의 경로 설정
        cookie.setMaxAge(0); // 쿠키의 유효 기간을 0으로 설정하여 삭제
        response.addCookie(cookie); // 쿠키를 응답에 추가하여 삭제 처리

        // 추가 작업이 필요하면 여기에 작성
        log.info("로그아웃 핸들러가 호출되었습니다."); // 로그 기록

    }
}
