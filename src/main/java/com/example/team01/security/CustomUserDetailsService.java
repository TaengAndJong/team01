package com.example.team01.security;


import com.example.team01.login.dao.LoginDao;
import com.example.team01.security.dao.CustomUserDtails;
import com.example.team01.vo.LoginVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Slf4j
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService{

    private final LoginDao loginDao;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        // clientId로 사용자 정보 조회
        LoginVO userData = loginDao.selectClientId(username);
        log.info("loginInfo:{}",userData);
        if (userData == null) {
            throw new UsernameNotFoundException("User not found with clientId: " + username);
        }


        // 데이터베이스에서 조회한 정보로 UserDetails 객체 생성
        return new CustomUserDtails(userData);
    }
}

// 로그인으로부터 들어온 정보를 데이터베이스에서 조회해서 가져오는 역할
//CoustomUserDtails 에  user정보를 전달해서 스프링 세션에 저장해 로그인이 가능하게 해줌

//UserDetailsService  스프링 시큐리티가 제공하는 인터페이스로
// UserDetailsService 구현 (loadUserByUsername 처리)
//private final LoginDao loginDao; mybatis사용 시 @mapper 선언된 Dao
//