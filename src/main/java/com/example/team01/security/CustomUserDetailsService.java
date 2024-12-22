package com.example.team01.security;


import com.example.team01.login.dao.LoginDao;
import com.example.team01.vo.LoginVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService{

    private final LoginDao loginDao;

    @Override
    public UserDetails loadUserByUsername(String clientId) throws UsernameNotFoundException {

        // clientId로 사용자 정보 조회
        LoginVO loginVO = loginDao.selectClientId(clientId);
        log.info("loginInfo:{}",loginVO);
        if (loginVO == null) {
            throw new UsernameNotFoundException("User not found with clientId: " + clientId);
        }

        // 데이터베이스에서 조회한 정보로 UserDetails 객체 생성
        return User.builder()
                .username(loginVO.getClientId())  // clientId
                .password(loginVO.getPassword())  // password
                .roles("CLIENT")  // 필요한 권한 추가 (예: "USER", "ADMIN" 등)
                .build();
    }
}

//UserDetailsService  스프링 시큐리티가 제공하는 인터페이스로
// UserDetailsService 구현 (loadUserByUsername 처리)
//private final LoginDao loginDao; mybatis사용 시 @mapper 선언된 Dao
//