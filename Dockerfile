
#1단계: 백엔드 빌드
FROM eclipse-temurin:17-jdk AS backend-builder
WORKDIR /app

#프론트 ,백엔드 빌드는 서버사양이 넉넉할때 사용
# 로컬 빌드 시, 로컬에서 서버로 전송항 jar 만 복사
# 2단계: 실행 이미지
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=backend-builder /app/target/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]