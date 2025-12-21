# 1. 빌드 단계
FROM eclipse-temurin:17-jdk AS builder
WORKDIR /app

# Maven 관련 파일 먼저 복사 (캐시 활용)
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline

# 소스 복사 후 빌드
COPY src src
RUN ./mvnw clean package -DskipTests

# 2. 실행 단계
FROM eclipse-temurin:17-jre
WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
