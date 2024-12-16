package com.example.team01.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfigurationSource;


@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private CorsConfigurationSource corsConfigurationSource;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http.cors(cors-> cors.configurationSource(corsConfigurationSource))
                .authorizeHttpRequests((authz) -> authz
                        .requestMatchers("/**").permitAll()  // 첫 페이지 인증 없이 허용
                        .requestMatchers("/admin/**").authenticated()  // 관리자 페이지 인증 필요
                        .requestMatchers("/login/**").authenticated()  // 로그인 페이지 인증 필요
                        .anyRequest().authenticated()  // 나머지 요청 인증 필요
                )
                .httpBasic(Customizer.withDefaults());
        return http.build();


    }




}
