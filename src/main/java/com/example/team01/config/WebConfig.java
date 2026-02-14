package com.example.team01.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.web.session.HttpSessionEventPublisher;
import org.springframework.web.cors.CorsConfiguration;

import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import org.springframework.web.servlet.DispatcherServlet;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

@Slf4j
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Value("${file.upload-dir}")
    private String uploadDir;
    @Value("${file.images-dir}")
    private String imagesDir;

    //전역 CORS 설정
    @Bean
    public UrlBasedCorsConfigurationSource corsConfigurationSource() {
        //
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        //
        CorsConfiguration config = new CorsConfiguration();
        //cors config 설정하기
        config.addAllowedOrigin("http://localhost:5173");  // 리액트 앱의 주소
        config.addAllowedOrigin("http://localhost:5174");
        config.addAllowedOrigin("http://localhost:5175");
        config.addAllowedOrigin("http://localhost:5176");
        config.addAllowedOrigin("http://localhost:5177");
        // 허용할 HTTP 메서드를 배열로 전달
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.addAllowedHeader("*");  // 허용할 모든 헤더
        config.setAllowCredentials(true);  // 쿠키를 포함한 요청을 허용할지 여부로 fetch 요청에서  credentials: 'include' 허용
        source.registerCorsConfiguration("/**", config);  // 모든 경로에 대해 CORS 설정
        // cors cofig 설정하여 담아준 source 반환
        return source;
    }

 //정적 리소스 허용 설정 보류
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        log.info("addResourceHandlers : {}",registry);
        log.info("uploadDir : {}",uploadDir);
        log.info("imagesDir : {}",imagesDir);

        WebMvcConfigurer.super.addResourceHandlers(registry);
        //파일업로드 경로 허용
        registry.addResourceHandler("/uploads/**") // 프론트의 URl 요청 
                .addResourceLocations("file:" + uploadDir); // 파일시스템 경로연결(실제파일위치) ==> 여기서 file: 넣어줘야  " : " 때문에 에러안남
        //이미지저장 경로 허용
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:" + imagesDir);

    }


    // 시큐리티 세션 이벤트 리스너 등록 ( 세션 만료 로그 확인용)
    /* 세션 만료, 로그아웃, 동시 로그인 제한 처리하는 클래스 */
    @Bean
    public HttpSessionEventPublisher httpSessionEventPublisher() {
        return new HttpSessionEventPublisher();
    }


}







