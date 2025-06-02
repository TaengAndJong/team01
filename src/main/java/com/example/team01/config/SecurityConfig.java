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
@EnableWebSecurity(debug = false)
@RequiredArgsConstructor
@Configuration
public class SecurityConfig {

    //cors 설정 webconfig
    private final WebConfig webConfig;
    // UserDetailsService 구현체 주입
    private final PrincipalDetailsService userDetailCustomServiceImple;


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, CustomAuthenticationSuccessHandler customAuthenticationSuccessHandler, CustomAuthenticationFailureHandler customAuthenticationFailureHandler, AddLogoutHandler addLogoutHandler) throws Exception {
        String[] allowedPaths = {"/", "/login", "/signUp/**", "/page", "/test/**","/book/**", "/menu","/uploads/**","/images/**"};

        http.cors(cors -> cors.configurationSource(webConfig.corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(authorizeReq ->
                        authorizeReq.requestMatchers(allowedPaths).permitAll() // 로그인 없이 접근 가능
                                .requestMatchers("/admin/**").hasAnyAuthority(Role.ADMIN.getKey(), Role.MEMBER.getKey())
                                .requestMatchers("/login/**", "/mypage/**","/cart/**").hasAnyAuthority(Role.USER.getKey(), Role.ADMIN.getKey(), Role.MEMBER.getKey())
                                .requestMatchers("/**").hasAnyAuthority(Role.USER.getKey(), Role.ADMIN.getKey(), Role.MEMBER.getKey())
                                .anyRequest().authenticated()) // 나머지 요청 인증 필요)
                .formLogin(form ->
                        form.loginPage("/login")// 프론트에서 접근하는 페이지(로그인 UI페이지)
                                .usernameParameter("clientId")//프론트에서 넘어오는 ID(보낸 파라미터 이름에 맞춤)
                                .passwordParameter("password")
                                .loginProcessingUrl("/login") // 실제 인증처리되는 브라우저 주소 (엔드포인트)
                                .successHandler(customAuthenticationSuccessHandler) // 로그인 성공 핸들러
                                .failureHandler(customAuthenticationFailureHandler) // 로그인 실패 핸들러
                                .permitAll()
                )
                .logout(logout -> logout
                        .logoutUrl("/logout") // 백엔드 주소 (로그아웃 요청을 실행할 백엔드 주소?)
                        .logoutSuccessUrl("/")
                        .addLogoutHandler(addLogoutHandler)//로그아웃 시 기타 처리 핸들러
                        .permitAll()
                ).sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                                .invalidSessionUrl("/login"));

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

