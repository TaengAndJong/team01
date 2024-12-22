package com.example.team01.security;

import com.example.team01.vo.LoginVO;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Getter
@RequiredArgsConstructor //final 선언된 객체에 생성자 주입
public class CustomUserDetails implements UserDetails {

    private final LoginVO loginVO; // 로그인 도메인 객체

    //사용자의 권한을 반환
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // role에 따른 권한 설정
        // Arrays.asList(new SimpleGrantedAuthority(loginVO.getRoleId()));
        return List.of();
    }


    //비밀번호 반환
    @Override
    public String getPassword() {
        return loginVO.getPassword();
    }

    //아이디 반환
    @Override
    public String getUsername() { 
        //Username을 ClientId 로 대체가능
        return loginVO.getClientId();
    }

    //계정이 만료되지 않았는지 확인 , true 반환 (만료되지 않음)
    @Override
    public boolean isAccountNonExpired() {
        return UserDetails.super.isAccountNonExpired();
    }

    //계정이 잠겨있는지 확인 ,  true 반환 (잠금되지 않음)
    @Override
    public boolean isAccountNonLocked() {
        return UserDetails.super.isAccountNonLocked();
    }

    //비밀번호가 만료되지 않았는지 확인 , true 이면 만료되지 않음
    @Override
    public boolean isCredentialsNonExpired() {
        return UserDetails.super.isCredentialsNonExpired();
    }

    // 계정이 활성화되어 있는지 확인 , true 반환 (활성화)
    @Override
    public boolean isEnabled() {
        return UserDetails.super.isEnabled();
    }

    // 로그인 정보 반환 , 클라이언트의 세부정보
    public LoginVO getLoginVO() {
        return loginVO;
    }

}


//  UserDetails 인터페이스는
//  Spring Security에서 사용자의 인증 및 권한을 표현하는 기본적인 인터페이스
// UserDetails 구현 (인증에 필요한 사용자 정보 담는 클래스)

// UserDetails 인터페이스를 구현한  CustomUserDetails 클래스는
// 사용자의 정보를 시큐리티의 인증 시스템에 맞게 변환하고 반환하는 역할