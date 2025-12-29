package com.example.team01.config;

import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;
@Configuration
@MapperScan(basePackages = {"com.example.team01.**.dao"})
@EnableTransactionManagement
public class MyBatisConfig {

    @Bean
    public SqlSessionFactory sqlSessionFactory(DataSource dataSource) throws Exception {
        SqlSessionFactoryBean factoryBean = new SqlSessionFactoryBean();
        // application.properties에서 설정된 DataSource 사용하지만 (MyBatis Spring Boot Starter 공식 문서를 참고)
        // , set으로 설정한 내용들이 application.properties에 적혀있더라도  무시되고 이 클래스 파일에 적힌 내용으로 설정됨 (mybatisCofig.xml도 무시)
        factoryBean.setDataSource(dataSource);
        factoryBean.setConfigLocation(new org.springframework.core.io.ClassPathResource("mybatis/config.xml")); // MyBatis 설정 파일 경로

        // 별칭(Alias)을 위해 VO 패키지 경로를 등록
        factoryBean.setTypeAliasesPackage("com.example.team01.vo");

        // Mapper XML 파일 경로, 클래스패스루트는 src/main/resources
        PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
        factoryBean.setMapperLocations(resolver.getResources("classpath:mybatis/mappers/**/*.xml"));

        return factoryBean.getObject();
    }

    @Bean
    public SqlSessionTemplate sqlSessionTemplate(SqlSessionFactory sqlSessionFactory) {
        return new SqlSessionTemplate(sqlSessionFactory);  // MyBatis 세션 템플릿 설정
    }

    @Bean
    public PlatformTransactionManager transactionManager(DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);  // 트랜잭션 관리 설정
    }

}

// bindingException 발생 시 basepackage 문법 기입법 잘 살펴보기 .ㅠㅠ https://pebblepark.github.io/2021/04/09/mybatis-mapper-exception/