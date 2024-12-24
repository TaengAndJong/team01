package com.example.team01.security.dao;

import com.example.team01.vo.LoginVO;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class CustomUserDtails implements UserDetails {

    private LoginVO userData;

    public CustomUserDtails(LoginVO userData) {

        this.userData = userData;

    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
       Collection<GrantedAuthority> authorities = new ArrayList<GrantedAuthority>();

        authorities.add(new GrantedAuthority() {

            @Override
            public String getAuthority() {
                return userData.getRoleId();
            }
        });

        return authorities;
    }

    @Override
    public String getPassword() {
        return userData.getPassword();
    }

    @Override
    public String getUsername() {
        return userData.getClientId();
    }

    @Override
    public boolean isAccountNonExpired() {
        return UserDetails.super.isAccountNonExpired();
    }

    @Override
    public boolean isAccountNonLocked() {
        return UserDetails.super.isAccountNonLocked();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return UserDetails.super.isCredentialsNonExpired();
    }

    @Override
    public boolean isEnabled() {
        return UserDetails.super.isEnabled();
    }
}
