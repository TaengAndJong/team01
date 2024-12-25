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
@RequiredArgsConstructor
@Service
public class CustomUserDetailsService implements UserDetailsService{

    private final LoginDao loginDao;

    @Override
    public UserDetails loadUserByUsername(String clientId) throws UsernameNotFoundException {
        log.info("loadUserByUsername------------333:{}",clientId);

        //customProvider에서 넘어온 clientId 파라미터로  clientId로 사용자 정보 조회
        LoginVO userData = loginDao.selectClientId(clientId);

        log.info("loginInfo??????:{}",userData);
        if (userData == null) {
            throw new UsernameNotFoundException("User not found with clientId: " + clientId);
        }
        // UserDetail을 구현하고 있는 User 객체를 반환해줌. User 객체를 생성하기 위해 생성자로 회원의 이메일, 비밀번호, role을 파라미터로 넘겨줌.ㅁ
        // 데이터베이스에서 조회한 정보로 UserDetails 객체 생성
        return User.builder()
                .username(userData.getClientId())
                .password(userData.getPassword())
                .roles(userData.getRoleId().toString())
                .build();
    }
}

//new CustomUserDtails(userData);