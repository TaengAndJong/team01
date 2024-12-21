package com.example.team01.config;

import com.example.team01.security.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfigurationSource;


@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    @Autowired
    private CorsConfigurationSource corsConfigurationSource;

    private final CustomUserDetailsService customUserDetailsService;
//
//    @Bean
//    public BCryptPasswordEncoder encoder() {
//        return new BCryptPasswordEncoder();
//    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http.csrf(csrf -> csrf.disable())
                .cors(cors-> cors.configurationSource(corsConfigurationSource))
                .authorizeHttpRequests((requests) -> requests
                        .requestMatchers("/","/admin","/login").permitAll()  // 첫 페이지 인증 없이 허용
                        .requestMatchers("/admin/**").hasRole("admin") // ADMIN 역할 필요
                        .requestMatchers("/member/**").hasRole("member") //member 역할 필요
                        .requestMatchers("/mypage/**").authenticated() // // 인증된 사용자만 접근 가능
                        .anyRequest().authenticated()  // 나머지 요청 인증 필요

                ).formLogin((form)-> form.loginPage("/login")//사용자 정의 로그인 페이지
                        .permitAll()//로그인 페이지 인증 없이 접근 가능

                ).logout((logout)->
                        logout.logoutUrl("/logout").logoutSuccessUrl("/logout-success")
                                .deleteCookies("JSESSIONID")//쿠키삭제
                                .permitAll());//로그아웃 URL 인증없이 접근 가능
                //.httpBasic(Customizer.withDefaults()); // 브라우저에서 기본제공하는 팝업으로 비밀번호 아이디 요구
        return http.build();

    }

    @Bean
    public UserDetailsService userDetailsService() {
        UserDetails user =
                User.withDefaultPasswordEncoder()
                        .username("user")
                        .password("password")
                        .roles("USER")
                        .build();

        return new InMemoryUserDetailsManager(user);
    }


    //https://spring.io/guides/gs/securing-web




}
