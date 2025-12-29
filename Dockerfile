
#1단계: 백엔드 빌드
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
RUN ./mvnw clean package -DskipTests  # -o는 오프라인 모드 실행 ( 최초빌드시 실패가능)

# 3단계: 실행 이미지
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=backend-builder /app/target/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]