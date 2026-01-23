package com.example.team01.config;

import com.example.team01.common.Enum.Role;
import com.example.team01.logout.handler.AddLogoutHandler;
import com.example.team01.security.PrincipalDetailsService;
import com.example.team01.security.handler.CustomAuthenticationFailureHandler;
import com.example.team01.security.handler.CustomAuthenticationSuccessHandler;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

/**
 * "/uploads/**","/images/**" 와 같이 
 * 보통 정적 자원(이미지, JS, CSS 등)은 
 * 모든 사용자에게 허용해야 하므로, /uploads/** 같은 경로는 예외로 전체 허용하기
 *
 * **/




@Slf4j
@EnableWebSecurity(debug = false) // Spring Security가 URL 매칭을 로그
@RequiredArgsConstructor
@Configuration
public class SecurityConfig {

    //cors 설정 webconfig
    private final WebConfig webConfig;
    // UserDetailsService 구현체 주입
    private final PrincipalDetailsService userDetailCustomServiceImple;


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, CustomAuthenticationSuccessHandler customAuthenticationSuccessHandler, CustomAuthenticationFailureHandler customAuthenticationFailureHandler, AddLogoutHandler addLogoutHandler) throws Exception {
        //로그인 여부(인증여부)와 상관없이 접근 가능한 경로들
        String[] allowedPaths = {
                "/", "/login/**", "/signup/**", "/uploads/**", "/images/**","/auth",
               "/page", "/book/**", "/menu","/uploads/**","/images/**","/check/**"
        };


        http
                .cors(cors -> cors.configurationSource(webConfig.corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .formLogin(form ->
                        form.loginPage("/login")// 로그인 할 페이지 경로 (URL)로 로그인이 필요할 경우 이 페이지 사용하라고 시큐리티를 설정
                                .usernameParameter("clientId")//로그인 할 아이디와 비밀번호로 파라미터명이 요청으로 들어온 데이터의 키 값과 동일해야 함
                                .passwordParameter("password")
                                .loginProcessingUrl("/login") // 실제 로그인 인증을 처리하는 URL (엔드포인트)
                                                            // 이 요청을 usernamePassword인증필터가 가로 챈후, 인증 데이터 추출 후 인증 토큰 생성, AuthenticationManager로 토큰 위임 ,AuthenticationProvider  인증 수행
                                .successHandler(customAuthenticationSuccessHandler) // usernamePassword인증 성공 시 실행 , securityContext에 저장
                                .failureHandler(customAuthenticationFailureHandler) // usernamePassword인증 실패 시 실행
                                .permitAll() // 인증 없이 접근 가능 허용
                )

                .logout(logout -> logout
                        .logoutUrl("/logout")  // 로그아웃 요청 URL
                        .logoutSuccessUrl("/") // 로그아웃 요청 URL
                        .invalidateHttpSession(true) // 로그아웃 요청 URL
                        .deleteCookies("JSESSIONID")// 세션 쿠키 삭제
                        .permitAll()
                )

                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                                .invalidSessionUrl("/login") // 세션 만료시 이동
                                .maximumSessions(1)//최대 세션수(중복로그인 방지)
                                .expiredUrl("/login") // 중복로그인시 이동
                )

                .exceptionHandling(exception
                        -> exception.authenticationEntryPoint((request,response,authException) -> {
                        log.info("401 미로그인 예외");
                        //인증실패(미로그인 시)
                        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401
                        response.setContentType("application/json;charset=UTF-8");//json으로 응답
                        response.getWriter().write("{\"message\":\"로그인페이지로 이동하시겠습니까?\"}");
                        })
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            log.info("403 권한부족 예외");
                            // 권한 부족 (403 JSON)
                            response.setStatus(HttpServletResponse.SC_FORBIDDEN); // 403
                            response.setContentType("application/json;charset=UTF-8");//json으로 응답
                            response.getWriter().write("{\"message\":\"접근 권한이 없습니다.\"}");
                        })
                )

                .authorizeHttpRequests(authorizeRequest ->
                        authorizeRequest.requestMatchers(allowedPaths).permitAll() // 로그인 없이 접근 가능한 URL
                                .requestMatchers( "/mypage/**","/cart/**","/board/**").hasAnyAuthority(Role.USER.getKey(), Role.ADMIN.getKey(), Role.MEMBER.getKey()) //역할별 접근
                                .requestMatchers("/admin/**").hasAnyAuthority(Role.ADMIN.getKey(), Role.MEMBER.getKey()) // 관리자만
                                .anyRequest().authenticated());// 그외 나머지 요청은 나머지 요청 인증 필요
        return http.build();
    }


    @Bean
    public AuthenticationManager authenticationManagerBean(HttpSecurity http) throws Exception {
        log.info("AuthenticationManager 인증관리자------------");
        AuthenticationManagerBuilder authenticationManagerBuilder =
                http.getSharedObject(AuthenticationManagerBuilder.class);
        authenticationManagerBuilder.userDetailsService(userDetailCustomServiceImple)
                .passwordEncoder(bCryptPasswordEncoder());
        return authenticationManagerBuilder.build();
    }

    // BCryptPasswordEncoder 빈 등록
    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

}

// .anonymous(anon -> anon.principal("anonymousUser")) // principal null 처리