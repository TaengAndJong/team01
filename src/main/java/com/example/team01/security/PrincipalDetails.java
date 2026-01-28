package com.example.team01.security;

import com.example.team01.vo.LoginVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.ArrayList;
import java.util.Collection;

/*
* UserDetails은 인증과 권한 검사를 위해 필요한 사용자정보를 정의한 인터페이스로,
* 인증된 사용자 정보를 보관하며 사용자 데이터를 제공
* 아이디, 비밀번호, 계정 상태(활성화/비활성화), 권한 목록 등
* 시큐리티 내부에서 UserDetails 타입으로 사용자 정보를 다루기 때문에, 필수로 구현해야 하는 인터페이스
*
* principalDetails는 스프링 빈이 아니라서 @Service 선언하면 안됨
* 이유는 스프링 컨테이너가 싱글톤을 생성하여 모든 사용자 로그인 시 같은 객체를 공유하기 때문에 싱글톤이 되면 안됨
* 싱글톤이 되면 하나의 객체를 모두 공유해서 사용하기 때문에
* 기존 로그인 사용자 정보가 덮여져서 보안 문제가 발생(사용자 정보는 각기 다르기 때문에 공유하면 안됨) = 데이터 정합성
* RequiredArgsConstructor 는 생성자를 필수로 생성해주는 롬복 어노테이션으로 생성자 작성할 필요 없음
* */


@Slf4j
@RequiredArgsConstructor
public class PrincipalDetails implements UserDetails {

    //DB에서 사용자 정보를 조회하기 위해 필요한 VO
   private final LoginVO userData;

    // 사용자에 대한 데이터 사용하기 위한 getter
    public LoginVO getUserData() {
        return userData;
    }

   //권한 관련 작업 
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        log.info("권한 가져오기 getAuthorities:{}",userData.getRoleId());

        //userName(ID) , password , role
        Collection<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(userData.getRoleId())); // 권한 추가
        log.info("권한들:{}",authorities);
        return authorities;
    }

    @Override
    public String getUsername() {
        log.info("사용자 아이디:{}",userData.getClientId());
       //로그인 시 사용한 아이디 반환
        return userData.getClientId();
    }

    @Override
    public String getPassword() {
       log.info("사용자 비밀번호:{}",userData.getPassword());
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