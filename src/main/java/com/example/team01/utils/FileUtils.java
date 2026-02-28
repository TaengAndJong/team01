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
import java.util.*;


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

    /*
     * inMemory 설정(application.properties)
     * middlePath : 파일을 저장한 중간 경로 /book/
     * 고려사항
     * 파일의 확장자의 대문자 또는 소문자일 경우 하나의 경우의 수로 검증필요 toLowerCase()
     * 이미지 파일의 확장자가 jpg, png 두 가지 검증 필요 
     * - 실제파일 스캔 방식 선호
     *  */

    // inMemory 설정에서 업로드 디렉토리 값 주입
    @Value("${file.upload-dir}")
    private  String uploadDir;
    @Value("${file.images-dir}")
    private  String imagesDir;


    // MultipartFile 파라미터 받아서 파일 저장 메서드
    public String saveSingleMultiPartFile(MultipartFile file, String middlePath){
        return "수정중";
        //return saveFile(List.of(file), middlePath);
    }

    // 이미지 여러 파일 저장 메서드
    //날데이터 받아서 문자열로 경로반환 저장메서드
    public List<String> saveFile(List<MultipartFile> files,String middlePath) {
       //파일 객체만 저장하는 역할 ( 일반 파일, 이미지파일 공통사용 메서드 )
        log.info("saveFile 파일 저장 시작 파일 객체:{}", files);
        List<String> savedPaths = new ArrayList<>(); //반환할 데이터베이스 텍스트경로

        if(files == null || files.isEmpty()){ // 리스트 존개여부 확인
            return savedPaths; // 그냥 빈 리스트 반환
        }

        //파일 객체가 있을 경우, 배열 순회
        for (MultipartFile file : files) {

            //개별 파일 존재여부 확인 ( 업로드가 안 된 파일 건너뛰기 )
            if(file == null || file.isEmpty()){
                continue;
            }

            String original = file.getOriginalFilename(); // 실제 파일 명
            String lowerOriginal = original.toLowerCase(); // 파일명 소문자로 통일

            String fileName = UUID.randomUUID().toString() + "_" + lowerOriginal; //랜덤 파일 명칭(중복방지)
           log.info("새로 생성된 파일이름:{}", fileName);

            //실제파일을 프로젝트 내부에(서버) 저장
            //여기에서 실제 경로에 파일저장
            String saveFilePath = uploadDir + File.separator + middlePath + File.separator + fileName;//운영체제에 맞게 파일 경로 생성하기 위한 코드
            Path path = Paths.get(saveFilePath); //파라미터에 해당하는 파일 경로를 가져오는 Path 변수로, 해당 파일을 저장할 파일명을 포함한 경로를 의미

            //실제 파일 시스템 경로에 저장
            try {
                Files.createDirectories(path.getParent()); // middlePath 명으로 폴더 생성
                file.transferTo(path); //Spring이 제공하는 공식 업로드 저장 방식, 실제 경로에 파일저장

                //DB에 저장할 경로
                String dbPath = middlePath + "/" + fileName;
                savedPaths.add(dbPath); // 디비에 저장할 파일 경로 List에 추가

            } catch (IOException e) {
                throw new RuntimeException("파일 저장 실패", e);
            }
        }//for문 종료
        
        return savedPaths; //결과 반환
    }
    //method end

    // 이미지가 없는 경우 사용할 메소드 , IOException > FileNotFoundException
    public String getDefaultImgPath(){
        String noImgPath="";

        // 파일 객체가 없으면, frontend/dist/assets/images/common/noImg.png(jpg) 가져오기
        // png,jpg 파일의 확장자 구분 및 실제 존재여부 확인 ==> 파일객체로 실제 파일을 스캔하여 확인
        log.info("imagesDir 노이미지 루트경로 :{} ",imagesDir);
        File defaultImage  = new File(imagesDir); // 팡,
        log.info("defaultImage -- :{} ",defaultImage);
        log.info("defaultImage.getPath() -- :{} ",defaultImage.getPath());

        if(!defaultImage.exists()){ //기본 이미지 존재 하지 않으면 예외 던지기
            throw new RuntimeException("기본 이미지가 존재하지 않습니다: " + defaultImage.getPath());
        }

        log.info(" 기본이미지 경로 메서드 파일 객체 존재할 경우---");
        // 소문자로 통일
        String name = defaultImage.getName().toLowerCase();
        log.info("기본이지미 파일 이름과 확장자 전부 소문자로 변경 완료 :{} ",name);
        if(name.equals("noimg.png") || name.equals("noimg.jpg")) {
           // 서버에서 클라이언트로 이미지를 리소스를 보낼때 상대경로를 사용해야 함
            //절대경로는 파일 시스템경로를 반환하기때문에 클라이언에서 사용불가
            log.info("노이미지 이름 :{} ",name);
            noImgPath = name;
            log.info("노이미지에 설정된 반환 결과--------------:{} ",noImgPath);
            return noImgPath; // 경로 리턴
        }
        // 실제 이미지 파일 경로, 실제 경로를 디비로 저장해야함
        return noImgPath;
    }

    //실서버에 저장된 이미지파일 삭제( + 데이터베이스 bookImgPath 에서도 해당 파일 삭제(갱신) 해줘야 데이터 정합성이 유지됨)
    public String deleteFiles(List<String> fileNames,String middlePath) {

        log.info("fileNames------deleteFiles :{} ",fileNames);
        log.info("fileNames------middlePath :{} ",middlePath);
        // 삭제할 파일 레코드 아이디 받아오기 ==> List<String> fileNames
        String deleteFilePath = uploadDir + File.separator + middlePath + File.separator;//운영체제에 맞게 파일 경로 생성하기 위한 코드
        //File 클래스를 사용하는 이유는, 파일시스템에서 해당경로의 파일을 조작하기 위해서 파일 객체를 사용



       return "서버에 저장된 이미지파일 삭제완료 ";
    }
}
