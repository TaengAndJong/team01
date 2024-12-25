package com.example.team01.security;

import com.example.team01.vo.LoginVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;


@Slf4j
public class CustomUserDtails implements UserDetails {

    private final LoginVO userData;

    public CustomUserDtails(LoginVO userData) {

        this.userData = userData;
        log.info("userData :{}",userData);
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
       Collection<GrantedAuthority> authorities = new ArrayList<GrantedAuthority>();

        authorities.add(new GrantedAuthority() {

            @Override
            public String getAuthority() {

                log.info("getRoleId :{}",userData.getRoleId());

                return userData.getRoleId();
            }
        });

        return authorities;
    }

    @Override
    public String getPassword() {

        log.info("getPassword :{}",userData.getPassword());

        return userData.getPassword();
    }

    @Override
    public String getUsername() {

        log.info("userData.getClientId:{}",userData.getClientId());
        return userData.getClientId();

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
