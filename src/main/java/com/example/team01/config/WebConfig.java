package com.example.team01.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.List;

@Configuration
public class WebConfig {
    //전역 CORS 설정
    @Bean
    public UrlBasedCorsConfigurationSource corsConfigurationSource() {
        //
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        //
        CorsConfiguration config = new CorsConfiguration();
        //cors config 설정하기
        config.addAllowedOrigin("http://localhost:5175");  // 리액트 앱의 주소
        // 허용할 HTTP 메서드를 배열로 전달
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.addAllowedHeader("*");  // 허용할 모든 헤더
        config.setAllowCredentials(true);  // 쿠키를 포함한 요청을 허용할지 여부
        source.registerCorsConfiguration("/**", config);  // 모든 경로에 대해 CORS 설정
        // cors cofig 설정하여 담아준 source 반환
        return source;
    }
}




