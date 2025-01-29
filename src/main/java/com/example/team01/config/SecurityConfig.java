package com.example.team01.config;

import com.example.team01.common.Enum.Role;

import com.example.team01.logout.handler.AddLogoutHandler;
import com.example.team01.logout.handler.CustomLogoutSuccessHandler;
import com.example.team01.security.UserDetailCustomServiceImple;
import com.example.team01.security.handler.CustomAuthenticationFailureHandler;
import com.example.team01.security.handler.CustomAuthenticationSuccessHandler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.logout.CookieClearingLogoutHandler;
import org.springframework.security.web.authentication.logout.HeaderWriterLogoutHandler;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.header.writers.ClearSiteDataHeaderWriter;


@Slf4j
@EnableWebSecurity(debug = true)
@RequiredArgsConstructor
@Configuration
public class SecurityConfig {
    
    //cors 설정 webconfig
    private final WebConfig webConfig;
    // UserDetailsService 구현체 주입
    private final UserDetailCustomServiceImple userDetailCustomServiceImple;

    // BCryptPasswordEncoder 빈 등록
    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // AuthenticationManager를 빈으로 등록, 인증을 담당하는 핵심 컴포넌트로 RESTful API로그인 처리 구현시 빈으로 등록
    @Bean
    public AuthenticationManager authenticationManagerBean(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder authenticationManagerBuilder =
                http.getSharedObject(AuthenticationManagerBuilder.class);
        authenticationManagerBuilder.userDetailsService(userDetailCustomServiceImple)
               .passwordEncoder(bCryptPasswordEncoder());
        return authenticationManagerBuilder.build();
    }


    private final  CustomAuthenticationSuccessHandler customAuthenticationSuccessHandler;
    private final CustomAuthenticationFailureHandler customAuthenticationFailureHandler;
    private final AddLogoutHandler addLogoutHandler;
    private final CustomLogoutSuccessHandler customLogoutSuccessHandler;


    // 5버전 이후 web~Adapter 대신 filterChain 사용
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        log.info("SecurityFilterChain------------11111 :{}", http);


        // 개발환경에서는 csrf 비활성해야 로그인이 가능함

        http.cors(cors -> cors.configurationSource(webConfig.corsConfigurationSource()))
                .authorizeHttpRequests(requests -> requests
                        .requestMatchers("/", "/login*", "/signUp/**", "/page", "/test/**").permitAll() // 로그인 없이 접근 가능
                        .requestMatchers("/admin/**").hasRole(Role.ADMIN.name())
                        .requestMatchers("/login/**", "/mypage/**").hasAnyRole(Role.USER.name(), Role.ADMIN.name(), Role.MEMBER.name())
                        .anyRequest().authenticated() // 나머지 요청 인증 필요
                )

                .formLogin(form -> form
                        .loginPage("/login") // 프론트 주소 (로그인을 요청할 URL)
                        .defaultSuccessUrl("/")
                        .usernameParameter("username")
                        .passwordParameter("password")
                        .loginProcessingUrl("/api/login") // 실제 인증처리되는 백엔드주소
                        .successHandler(customAuthenticationSuccessHandler)
                        .failureHandler(customAuthenticationFailureHandler) //
                        .permitAll()
                )
                .logout(logout -> logout
                                .logoutUrl("/logout") // 백엔드 주소 (로그아웃 요청을 실행할 백엔드 주소?)
                                .logoutSuccessUrl("/") // 로그아웃 성공시 리다이렉트 할 URL
                                .addLogoutHandler(addLogoutHandler)  // 로그아웃 후 세션 무효화 및 추가 작업 처리
                                //.logoutSuccessHandler(customLogoutSuccessHandler) // 로그아웃 성공 후 실행
                                .permitAll()
                ).csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED) // 필요 시 세션 생성
                        .invalidSessionUrl("/login") // 세션 만료 시 이동할 URL
                        .maximumSessions(1) // 최대 허용 세션 수
                        .expiredUrl("/login?expired=true") // 세션 만료 후 이동 URL
                );


        // 모든 설정이 끝난 후에 build 호출

        return http.build();
    }


}


//실제 로직이 처리되는 Url은 백엔드 서버 주소로 해야하고 나머지는 프론트 서버 주소를 기준으로 작성, 리다이렉션도 동일
//https://docs.spring.io/spring-security/reference/servlet/authentication/logout.html