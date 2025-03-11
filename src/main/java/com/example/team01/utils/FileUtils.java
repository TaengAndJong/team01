package com.example.team01.utils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Value; // 롬복 사용하면 안됨, inMemory에서 가져오려면 이 패키지 사용해야 함

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;


/*
* static Methods만 제공하기 때문에 스프링에 빈 등록할 필요가 없고 클래스명.메소드(파라미터)로 호출
* 비즈니스 로직이 들어가지 않기때문이기도 함
* 
* static Methods로 선언하는 이유 
* 유틸리트 클래스는 인스턴스(객체)를 생성할 필요가 없는 기능을 제공
* 상태(멤버변수)를 가지지 않고, 파일을 처리하는 기능만 제공하기때문에, 객체를 만들지 않고 사용가능
* new 연산자를 선언하여 객체를 생성할 필요가 없기 때문에 ==> 예) FIle.saveFiles(file)
* */



@Slf4j
@Component
public class FileUtils {

    // inMemory 설정에서 업로드 디렉토리 값 주입
    @Value("${file.upload-dir}")
    private  String uploadDir;
    /*
    *
     * middlePath : 파일을 저장한 중간 경로 /book/
     *
     *  */

    public String saveFile(List<MultipartFile> fileObject,String middlePath) {
        String bookImgPath=""; //반환할 데이터베이스 텍스트경로
        log.info("bookImgPath ---------11111:{}",bookImgPath);
        if(!fileObject.isEmpty()) {
            for (MultipartFile file : fileObject) {
                String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename(); //랜덤 파일 명칭(중복방지)
                log.info("fileName:{}", fileName);

                //2. 데이터베이스에 파일 저장(
                if(!bookImgPath.equals("")) { // 북이미지 텍스트 배열로 받고 구분하기 위한 조건 ( 텍스트 파일 경로가 존재하면, 기존 경로 + 파일명)
                    bookImgPath= bookImgPath +","+fileName;//랜덤 파일명칭 텍스트로 생성
                    log.info("bookImgPath:{}", bookImgPath);
                }else{
                    bookImgPath = fileName;
                    log.info("bookImgPath:{}", bookImgPath);
                }

                //실제파일을 프로젝트 내부에(서버) 저장
                //여기에서 실제 경로에 파일저장
                String saveFilePath = uploadDir + File.separator + middlePath + File.separator + fileName;//운영체제에 맞게 파일 경로 생성하기 위한 코드
                Path path = Paths.get(saveFilePath); //파라미터에 해당하는 파일 경로를 가져오는 Path 변수로, 해당 파일을 저장할 파일명을 포함한 경로를 의미
                log.info("path-------------------:{}", path);
                try {
                    //upload 디렉토리가 없는 경우 noSuchFileExcption 방지
                    Files.createDirectories(path.getParent()); // 디렉터리(폴더) 없으면 생성
                    Files.write(path, file.getBytes()); // 파일 저장
                    log.info("파일 저장 완료: {}", saveFilePath);
                } catch (IOException e) {
                    log.error("파일 저장 실패: {}", e.getMessage());
                }

            }
            // List<String> bookImgPath를 하나의 문자열로 변환
            log.info("bookImgPath---------------------데이터베이스에 저장할 문자열:{}", bookImgPath); // 리스트 객체
            // 객체를 또 순회해서 문자열로 만들어야함 ?????
        }
        return bookImgPath; // 여기에서 bookImaPath 반환하여 초기값 갱신
    }
    //method end




}
