# 1단계: 프론트엔드 빌드
FROM node:20 AS frontend-builder
WORKDIR /app/frontend

# 프론트엔드 의존성 파일 복사 및 설치
COPY frontend/package*.json ./
RUN npm install

# 프론트엔드 소스 전체 복사 및 빌드
COPY frontend/ ./
RUN npm run build


# 2단계: 백엔드 빌드
FROM eclipse-temurin:17-jdk AS backend-builder
WORKDIR /app

# Maven 관련 파일 복사 및 의존성 미리 받기
COPY pom.xml ./
COPY mvnw ./
COPY .mvn .mvn
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline

# 백엔드 소스 복사
COPY src src

# 프론트엔드 빌드 결과물을 백엔드 리소스 경로로 복사
COPY --from=frontend-builder /app/frontend/dist ./src/main/resources/static

# 백엔드 빌드 실행 (프론트 정적 리소스 포함)
RUN ./mvnw clean package -DskipTests


# 3단계: 실행 이미지
FROM eclipse-temurin:17-jre
WORKDIR /app

COPY --from=backend-builder /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
