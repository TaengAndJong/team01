package com.example.team01.config;

import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;
@Configuration
@MapperScan(basePackages = "com.example.team01.pages.dao")
@EnableTransactionManagement
public class MyBatisConfig {

    @Bean
    public SqlSessionFactory sqlSessionFactory(DataSource dataSource) throws Exception {
        SqlSessionFactoryBean factoryBean = new SqlSessionFactoryBean();
        // application.properties에서 설정된 DataSource 사용
        factoryBean.setDataSource(dataSource);
        factoryBean.setConfigLocation(new org.springframework.core.io.ClassPathResource("mybatis/config.xml")); // MyBatis 설정 파일 경로
        // Mapper XML 파일 경로, 클래스패스루트는 src/main/resources m
        factoryBean.setMapperLocations(new org.springframework.core.io.ClassPathResource("mybatis/mappers/pageMapper.xml"));

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
