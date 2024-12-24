package com.example.team01.config;


import com.example.team01.security.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;


@Slf4j
@Configuration
@EnableWebSecurity(debug=true)
@RequiredArgsConstructor
public class SecurityConfig {

    @Autowired
    private WebConfig webConfig;

    private final CustomUserDetailsService customUserDetailsService;

    // AuthenticationManager를 빈으로 등록
    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        // AuthenticationManagerBuilder를 수동으로 사용하여 userDetailsService 설정
        AuthenticationManagerBuilder authenticationManagerBuilder =
                http.getSharedObject(AuthenticationManagerBuilder.class);

        authenticationManagerBuilder.userDetailsService(customUserDetailsService);
        log.info("AuthenticationManager  : {}",authenticationManagerBuilder.userDetailsService(customUserDetailsService));
//                .passwordEncoder(passwordEncoder());  // 비밀번호 인코더 설정

        return authenticationManagerBuilder.build();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    //개발환경에서는 csrf 비활성해야 로그인이 가능함
        http.csrf(csrf -> csrf.disable())
                .cors(cors-> cors.configurationSource(webConfig.corsConfigurationSource()))
                .authorizeHttpRequests((requests) -> requests
                                .requestMatchers("/","/api","/login","/signUp","/page").permitAll()
                                .requestMatchers("/admin").hasRole("ADMIN")
                                .requestMatchers("/login/**","/mypage/**").hasAnyRole("ADMIN","MEMBER","CLIENT")
                                .anyRequest().authenticated()// 나머지 요청 인증 필요

                        //.hasAuthority("admin") 하면 admin으로 데이터베이스에 전달

                ).formLogin((form)-> form
                        .loginPage("/login")
                        .defaultSuccessUrl("/page", true) //사용자 정의 로그인 페이지
                        .failureUrl("/login?error=true")// 로그인 실패 시 이동할 URL
                        .permitAll()//로그인 페이지 인증 없이 접근 가능

                ).logout((logout)->
                        logout.logoutUrl("/logout").logoutSuccessUrl("/logout-success")
                                .deleteCookies("JSESSIONID")//쿠키삭제
                                .permitAll());//로그아웃 URL 인증없이 접근 가능
        return http.build();


    }




    //https://spring.io/guides/gs/securing-web




}
