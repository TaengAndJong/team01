package com.example.team01.security;

import com.example.team01.login.dao.LoginDao;
import com.example.team01.vo.LoginVO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;



@RequiredArgsConstructor
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final LoginDao loginDao;

    @Override
    public UserDetails loadUserByUsername(String clientId) throws UsernameNotFoundException {

        LoginVO loginVO = loginDao.selectClientId(clientId); // 클라이언트 아이디에 해당하는 회원정보 조회 객체

        if (loginVO == null) {
            throw new UsernameNotFoundException("User not found");
        }

        // 로그인 정보를 기반으로 LoginVO를  UserDetails 객체로 변환
        return new CustomUserDetails(loginVO);
    }
    
}

//UserDetailsService  스프링 시큐리티가 제공하는 인터페이스로
// UserDetailsService 구현 (loadUserByUsername 처리)
//private final LoginDao loginDao; mybatis사용 시 @mapper 선언된 Dao
//