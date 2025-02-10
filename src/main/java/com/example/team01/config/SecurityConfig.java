package com.example.team01.config;

import com.example.team01.common.Enum.Role;
import com.example.team01.security.PrincipalDetailsService;


import com.example.team01.security.handler.CustomAuthenticationFailureHandler;
import com.example.team01.security.handler.CustomAuthenticationSuccessHandler;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.boot.web.servlet.ServletListenerRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.logout.HeaderWriterLogoutHandler;
import org.springframework.security.web.header.writers.ClearSiteDataHeaderWriter;
import org.springframework.security.web.session.HttpSessionEventPublisher;

import static org.springframework.security.web.header.writers.ClearSiteDataHeaderWriter.Directive.*;


@Slf4j
@EnableWebSecurity(debug = true)
@RequiredArgsConstructor
@Configuration
public class SecurityConfig {
    
    //cors 설정 webconfig
    private final WebConfig webConfig;
    // UserDetailsService 구현체 주입
    private final PrincipalDetailsService userDetailCustomServiceImple;

    //maximumSessions(1) 설정을 사용할 때 필요
    @Bean
    public ServletListenerRegistrationBean<HttpSessionEventPublisher> httpSessionEventPublisher() {
        return new ServletListenerRegistrationBean<>(new HttpSessionEventPublisher());
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, CustomAuthenticationSuccessHandler customAuthenticationSuccessHandler, CustomAuthenticationFailureHandler customAuthenticationFailureHandler) throws Exception {
        String[] allowedPaths = { "/", "/login", "/signUp/**", "/page", "/test/**" };

        http.cors(cors-> cors.configurationSource(webConfig.corsFilter()))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(authorizeReq ->
                        authorizeReq.requestMatchers(allowedPaths).permitAll() // 로그인 없이 접근 가능
                        .requestMatchers("/admin/**").hasAnyRole(Role.ADMIN.name(),Role.MEMBER.name())
                        .requestMatchers("/login/**", "/mypage/**").hasAnyRole(Role.USER.name(), Role.ADMIN.name(), Role.MEMBER.name())
                        .anyRequest().authenticated()) // 나머지 요청 인증 필요)
                .formLogin(form ->
                        form.loginPage("/login")// 프론트에서 접근하는 페이지(로그인 UI페이지)
                        .usernameParameter("clientId")//프론트에서 넘어오는 ID(보낸 파라미터 이름에 맞춤)
                        .passwordParameter("password")
                        .loginProcessingUrl("/login") // 실제 인증처리되는 브라우저 주소 (엔드포인트)
                                .successHandler(customAuthenticationSuccessHandler)
                                .failureHandler(customAuthenticationFailureHandler)
                        .permitAll()
                )
                .logout(logout -> logout
                        .logoutUrl("/logout") // 백엔드 주소 (로그아웃 요청을 실행할 백엔드 주소?)
                        .logoutSuccessUrl("/")
                        .addLogoutHandler(new HeaderWriterLogoutHandler(new ClearSiteDataHeaderWriter(COOKIES)))
                        .permitAll()
                ).sessionManagement(session
                        -> session.sessionCreationPolicy(SessionCreationPolicy.ALWAYS)
                        .sessionFixation().newSession()
                        .maximumSessions(1)
                        .maxSessionsPreventsLogin(true)
                        .expiredUrl("/login") // 세션 만료 후 리디렉션할 URL
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
