#프론트 ,백엔드 빌드는 서버사양이 넉넉할때 사용
# 로컬 빌드 시, 로컬에서 서버로 전송항 jar 만 복사

# 2단계: 실행 이미지
# 빌드 단계 없이 실행 환경(JRE)만 바로 사용합니다.
FROM eclipse-temurin:17-jre
WORKDIR /app

# 로컬에서 올려준 target 폴더의 jar 파일을 현재 컨테이너 위치로 복사합니다.
# (이때 우분투의 Dockerfile이 있는 폴더에 target 폴더가 실제로 있어야 합니다.)
COPY target/*.jar app.jar

EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]