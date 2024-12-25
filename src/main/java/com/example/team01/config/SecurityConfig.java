package com.example.team01.config;

import com.example.team01.common.Enum.Role;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;

@Slf4j
@EnableWebSecurity(debug = true)
@RequiredArgsConstructor()
@Configuration
public class SecurityConfig {

    private final WebConfig webConfig;
    private final DataSource dataSource;


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        log.info("SecurityFilterChain------------11111 :{}", http);

        // 개발환경에서는 csrf 비활성해야 로그인이 가능함
        http.csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(webConfig.corsConfigurationSource()))
                .authorizeRequests((requests) -> requests
                        .requestMatchers("/", "/api", "/login", "/signUp", "/page").permitAll()
                        .requestMatchers("/admin").hasRole(Role.ADMIN.name())
                        .requestMatchers("/login/**", "/mypage/**").hasAnyRole(Role.USER.name(), Role.ADMIN.name(), Role.MEMBER.name())
                        .anyRequest().authenticated() // 나머지 요청 인증 필요
                )
                .formLogin(form -> form
                        .loginPage("/api/login") // 백엔드 서버 주소로 해야함
                        .usernameParameter("clientId")
                        .passwordParameter("password")
                        .defaultSuccessUrl("/page", true) // 사용자 정의 로그인 페이지
                        .failureUrl("/login?error=true") // 로그인 실패 시 이동할 URL
                        .permitAll() // 로그인 페이지 인증 없이 접근 가능
                )
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/api") // 로그아웃 성공 시 리디렉션 URL
                        .deleteCookies("JSESSIONID") // 쿠키 삭제
                        .permitAll() // 로그아웃 URL 인증 없이 접근 가능
                );

        return http.build();
    }
}
