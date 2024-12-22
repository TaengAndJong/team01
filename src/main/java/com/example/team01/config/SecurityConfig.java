package com.example.team01.config;


import com.example.team01.security.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;



@Configuration
//@EnableWebSecurity //시큐리티 비활성화
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

        authenticationManagerBuilder.userDetailsService(customUserDetailsService)
                .passwordEncoder(passwordEncoder());  // 비밀번호 인코더 설정

        return authenticationManagerBuilder.build();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(customUserDetailsService);  // UserDetailsService 설정
        provider.setPasswordEncoder(passwordEncoder());  // 비밀번호 인코더 설정
        return provider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();  // BCrypt 인코더 사용
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http.csrf(csrf -> csrf.disable())
                .cors(cors-> cors.configurationSource(webConfig.corsConfigurationSource()))
                .authorizeHttpRequests((requests) -> requests
                                .requestMatchers("/**","/api/**","/admin/**","/login/**","/signUp/**","/page/**").permitAll()  // 첫 페이지 인증 없이 허용
                                .requestMatchers("/admin/**").hasAuthority("admin") // ADMIN 역할 필요
                                .requestMatchers("/member/**").hasAuthority("member") //member 역할 필요
                                .requestMatchers("/mypage/**").authenticated() // // 인증된 사용자만 접근 가능
                                .anyRequest().authenticated()  // 나머지 요청 인증 필요

                        //.hasAuthority("admin") 하면 admin으로 데이터베이스에 전달
                        //.hasRole("admin") 은 Role_admin으로 Role_접두사가 붙어 디비로 전달


                ).formLogin((form)-> form
                        .loginPage("/login")
                        .defaultSuccessUrl("/", true) //사용자 정의 로그인 페이지
                        .failureUrl("/login?error=true")// 로그인 실패 시 이동할 URL
                        .permitAll()//로그인 페이지 인증 없이 접근 가능

                ).logout((logout)->
                        logout.logoutUrl("/logout").logoutSuccessUrl("/logout-success")
                                .deleteCookies("JSESSIONID")//쿠키삭제
                                .permitAll());//로그아웃 URL 인증없이 접근 가능
        //.httpBasic(Customizer.withDefaults()); // 브라우저에서 기본제공하는 팝업으로 비밀번호 아이디 요구
        return http.build();


    }




    //https://spring.io/guides/gs/securing-web




}
