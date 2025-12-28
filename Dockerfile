# 1단계: 프론트엔드 빌드
FROM node:20 AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# 2단계: 백엔드 빌드
FROM eclipse-temurin:17-jdk AS backend-builder
WORKDIR /app
COPY pom.xml ./
COPY mvnw ./
COPY .mvn .mvn
RUN chmod +x mvnw
# 2. 의존성 미리 다운로드 (이 단계는 라이브러리가 변경될 때만 실행됨)
RUN ./mvnw dependency:go-offline -B

#소스코드 후 빌드
COPY src src
# [수정된 부분] 1단계(frontend-builder)에서 만든 dist를 2단계의 frontend/dist로 복사
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist
# 이제 mvn 빌드 시 Antrun이 ./frontend/dist를 찾아서 src/main/resources/static으로 복사합니다.
RUN ./mvnw clean package -DskipTests -o # -o는 오프라인 모드 실행

# 3단계: 실행 이미지
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=backend-builder /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]