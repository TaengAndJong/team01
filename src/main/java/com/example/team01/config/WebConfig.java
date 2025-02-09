package com.example.team01.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;


import java.util.List;

import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // 모든 경로에 대해 CORS 허용
                .allowedOrigins("http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176", "http://localhost:5177")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*") // 모든 헤더 허용
                .allowCredentials(true); // 쿠키를 허용하려면 true 설정
    }

    // CorsFilter 빈 추가
    @Bean
    public CorsConfigurationSource corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.addAllowedOrigin("http://localhost:5173");
        config.addAllowedOrigin("http://localhost:5174");
        config.addAllowedOrigin("http://localhost:5175");
        config.addAllowedOrigin("http://localhost:5176");
        config.addAllowedOrigin("http://localhost:5177");
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.addAllowedHeader("*");
        config.setAllowCredentials(true); // 쿠키포함허용
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}

//    //전역 CORS 설정
//    @Bean
//    public UrlBasedCorsConfigurationSource corsConfigurationSource() {
//        //
//        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//        //
//        CorsConfiguration config = new CorsConfiguration();
//        //cors config 설정하기
//        config.addAllowedOrigin("http://localhost:5173");  // 리액트 앱의 주소
//        config.addAllowedOrigin("http://localhost:5174");
//        config.addAllowedOrigin("http://localhost:5175");
//        config.addAllowedOrigin("http://localhost:5176");
//        config.addAllowedOrigin("http://localhost:5177");
//        // 허용할 HTTP 메서드를 배열로 전달
//        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
//        config.addAllowedHeader("*");  // 허용할 모든 헤더
//        config.setAllowCredentials(true);  // 쿠키를 포함한 요청을 허용할지 여부
//        source.registerCorsConfiguration("/**", config);  // 모든 경로에 대해 CORS 설정
//        // cors cofig 설정하여 담아준 source 반환
//        return source;
//    }





