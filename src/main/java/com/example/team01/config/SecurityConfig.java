package com.example.team01.config;

import com.example.team01.common.Enum.Role;
import com.example.team01.logout.handler.AddLogoutHandler;
import com.example.team01.security.PrincipalDetailsService;


import com.example.team01.security.handler.CustomAuthenticationFailureHandler;
import com.example.team01.security.handler.CustomAuthenticationSuccessHandler;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.session.SessionAuthenticationStrategy;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;


@Slf4j
@EnableWebSecurity(debug = true)
@RequiredArgsConstructor
@Configuration
public class SecurityConfig {
    
    //cors 설정 webconfig
    private final WebConfig webConfig;
    // UserDetailsService 구현체 주입
    private final PrincipalDetailsService userDetailCustomServiceImple;



    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        String[] allowedPaths = { "/", "/login", "/signUp/**", "/page", "/test/**" };

        http.cors(cors-> cors.configurationSource(webConfig.corsFilter()))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(authorizeReq ->
                        authorizeReq.requestMatchers(allowedPaths).permitAll() // 로그인 없이 접근 가능
                        .requestMatchers("/admin/**").hasAnyRole(Role.ADMIN.name(),Role.MEMBER.name())
                        .requestMatchers("/login/**", "/mypage/**").hasAnyRole(Role.USER.name(), Role.ADMIN.name(), Role.MEMBER.name())
                        .anyRequest().authenticated()) // 나머지 요청 인증 필요)
                .formLogin(form ->
                        form.loginPage("/login")// 프론트 주소 (로그인을 요청할 URL)
                        .usernameParameter("username")
                        .passwordParameter("password")
                        .loginProcessingUrl("/api/login") // 실제 인증처리되는 백엔드주소 (엔드포인트)
                        .defaultSuccessUrl("/") // 로그인 성공 시 리디렉션 URL
                        .permitAll()
                )
                .logout(logout -> logout
                        .logoutUrl("/logout") // 백엔드 주소 (로그아웃 요청을 실행할 백엔드 주소?)
                        .invalidateHttpSession(true) // 로그아웃 시 세션 무효화
                        .deleteCookies("JSESSIONID") // 로그아웃 시 쿠키 삭제
                        .logoutSuccessUrl("/")
                        .permitAll()
                );

        return http.build();
    }




    @Bean
    public AuthenticationManager authenticationManagerBean(HttpSecurity http) throws Exception {
        log.info("authenticateManager66666------------:{}");
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

 //.addLogoutHandler(addLogoutHandler)// 로그아웃 성공시 리다이렉트 할 URL
