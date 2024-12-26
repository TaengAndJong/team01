package com.example.team01.security;


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
public class UserDetailsImple implements UserDetails {
    //dao에서 사용할 데이터 가져오기

   private  LoginVO userData;

   public UserDetailsImple(LoginVO userData) {
       log.info("userData-----------------???-:{}",userData);
       this.userData = userData;
   }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {

        //userName(ID) , password , role
        Collection<GrantedAuthority> authorities = new ArrayList<>();

        authorities.add(new SimpleGrantedAuthority(userData.getRoleId())); // 권한 추가
        log.info("authorities------------------:{}",authorities);
        return authorities;
    }

    @Override
    public String getUsername() {
        log.info("getUsername------------------------------:{}",userData.getClientId());
        return userData.getClientId();
    }

    @Override
    public String getPassword() {
        log.info("getPassword222----------------------------:{}",userData.getPassword());
        return userData.getPassword();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
