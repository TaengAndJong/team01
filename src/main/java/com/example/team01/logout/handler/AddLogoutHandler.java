package com.example.team01.logout.handler;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;

public class AddLogoutHandler implements LogoutHandler {
    // 3. 세션 무효화 처리할 로그아웃 핸들러
    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        // 세션 무효화 처리
        if (request.getSession(false) != null) {
            request.getSession().invalidate();
            System.out.println("세션이 무효화되었습니다.");
        }
        // 추가 작업이 필요하면 여기에 작성
        System.out.println("로그아웃 핸들러가 호출되었습니다.");
    }
}
