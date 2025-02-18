package com.example.team01.security;


import com.example.team01.login.dao.LoginDao;
import com.example.team01.vo.LoginVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;


import java.util.ArrayList;
import java.util.Collection;


@Slf4j
@RequiredArgsConstructor
@Service
public class PrincipalDetails implements UserDetails {
    //dao에서 사용할 데이터 가져오기

   private LoginVO userData;
   private LoginDao dao;

   //인증 객체
   public PrincipalDetails(LoginVO userData) {
       //로그인 시 userData 파라미터로 받아오기 
       this.userData = userData;
   }

   //권한 관련 작업 
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {

        //userName(ID) , password , role
        Collection<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(userData.getRoleId())); // 권한 추가

        return authorities;
    }

    @Override
    public String getUsername() {
       //로그인 시 사용한 아이디 반환
        return userData.getClientId();
    }

    @Override
    public String getPassword() {
       //비밀번호 불일치 시 로직 추가 ?
       log.info("getPassword----------------------------:{}",userData.getPassword());
        return userData.getPassword();
    }




    //계정만료 되었는지 , true 는 계정만료 안됨
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    //계정이 잠겼는지 true는 안잠김
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    //비밀번호 만료 여부
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    //계정 활성화 여부(사용가능)
    @Override
    public boolean isEnabled() {
        return true;
    }
}

//https://chb2005.tistory.com/176