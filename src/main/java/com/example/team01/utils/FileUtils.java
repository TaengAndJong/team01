package com.example.team01.utils;
import com.example.team01.common.support.BookImgChange;
import com.example.team01.vo.AdminBookVO;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Value; // 롬복 사용하면 안됨, inMemory에서 가져오려면 이 패키지 사용해야 함

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static com.example.team01.utils.severUrlUtil.baseImageUrl;


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
    @Value("${file.noImg-dir}")
    private  String noImgDir;

//날데이터 받아서 문자열로 경로반환 저장메서드
    public String saveFile(List<MultipartFile> fileObject,String middlePath) throws FileNotFoundException {
        String bookImgPath=""; //반환할 데이터베이스 텍스트경로

        if(!fileObject.isEmpty()) {
            log.info("bookImgPath ---------11111:{}",bookImgPath);
            for (MultipartFile file : fileObject) {
                String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename(); //랜덤 파일 명칭(중복방지)
                log.info("fileName-----------------------:{}", fileName);

                //2. 데이터베이스에 1개 이상의 파일경로 문자열로 변환과정
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

                //저장한 후에 서버 주소 추가 ??

            }
            // List<String> bookImgPath를 하나의 문자열로 변환
            log.info("bookImgPath---------------------데이터베이스에 저장할 문자열:{}", bookImgPath); // 리스트 객체
            // 객체를 또 순회해서 문자열로 만들어야함 ?????
        }else{
            log.info("파일 객체가 널인데 ");
            //저장은 필요 없고, 서버의 resource 하위 경로에 저장되어있는 이미지파일리소스만 가져와서 bookImgPath에 넣어주기
            bookImgPath = this.getDefaultImgPath();
            log.info("noImg booImgPath================:{}",bookImgPath);
        }
        log.info("최종 이미지 패스 : {}",bookImgPath);
        return bookImgPath; // 여기에서 bookImaPath 반환하여 초기값 갱신
    }
    //method end
    
    // 이미지가 없는 경우 사용할 메소드 , IOException > FileNotFoundException
    public String getDefaultImgPath(){
        String noImgPath="";
        // 파일 객체가 없으면,src/main/resources/static/images에서 noImg.png(jpg) 가져오기
        log.info(" noImgDir-------------------------- : {}",noImgDir);
        // png,jpg 파일의 확장자 구분 및 실제 존재여부 확인 ==> 파일객체로 실제 파일을 스캔하여 확인
        File folder = new File(noImgDir);
        File[] Files = folder.listFiles();
        log.info("foler------------:{} , fileList--------- :{}", folder, Files);

        if(Files != null) {
        log.info("파일 객체 있따----------");
            for (File file : Files) {
                String name = file.getName().toLowerCase();
                log.info("파일 이름과 확장자 전부 소무자로 대체했다 --------------:{} ",name);
                if(name.equals("noimg.png") || name.equals("noimg.jpg")) {

                   // 서버에서 클라이언트로 이미지를 리소스를 보낼때 상대경로를 사용해야 함
                    //절대경로는 파일 시스템경로를 반환하기때문에 클라이언에서 사용불가
                   // noImgPath ="images/" + name;
                    noImgPath = name;
                    log.info("noImgPath--------------:{} ",noImgPath);
                    return noImgPath; // 경로 리턴
                }

            }
        }
        // 실제 이미지 파일 경로, 실제 경로를 디비로 저장해야함
        return noImgPath;
    }
    // file.getAbsolutePath 반환하면 자동으로 noImgPath에 대입 되는가?

    //BookImgList 레코드 값의 배열 조회를 통한 서버주소 추가 후 배열 갱신, 제네릭타입 선언<<<
    // VO객체와 request 파라미터를 넘겨줘야함!
    public <T extends BookImgChange> T changeImgPath(T vo, HttpServletRequest request){

        List<String> bookImgList = vo.getBookImgList();
        //vo.getBookImgList() 가 null 일 경우와 아닌 경우 분리하기

        log.info("bookImgList--------------:{}",bookImgList);
        log.info("bookImgList--------------:{}",baseImageUrl(request,"uploads/book"));

        // 1. bookImgList가 비었을 경우, bookImgPath로부터 리스트 생성
        if (bookImgList == null || bookImgList.isEmpty()) {
            bookImgList = Arrays.stream(vo.getBookImgPath().split(","))
                    .map(String::trim)
                    .filter(item -> !item.isEmpty())
                    .collect(Collectors.toList());
            log.info("bookImgList 비어있을 경우 재구성됨: {}", bookImgList);
        }

        // 2. 공통 URL 생성 처리
        List<String> imgUrlList = bookImgList.stream()
                .map(fileName -> {
                    String folder = fileName.toLowerCase().contains("noimg") ? "images" : "uploads/book";
                    return baseImageUrl(request, folder) + fileName;
                })
                .collect(Collectors.toList());

        vo.setBookImgList(imgUrlList);
        log.info("이미지 URL 최종 변환 완료: {}", vo);
        return vo;
    }


    //실서버에 저장된 이미지파일 삭제만
    public String deleteFiles(String fileNames,String middlePath) {
        log.info("fileNames----------del:{}",fileNames);
        // 삭제할 파일 레코드 아이디 받아오기 ==> List<String> fileNames
        String deleteFilePath = uploadDir + File.separator + middlePath + File.separator;//운영체제에 맞게 파일 경로 생성하기 위한 코드
        //File 클래스를 사용하는 이유는, 파일시스템에서 해당경로의 파일을 조작하기 위해서 파일 객체를 사용
        Arrays.stream(fileNames.split(","))
                .map(fileName -> new File(deleteFilePath + fileName))
                .forEach(file -> {
                    if (file.exists()) {
                        boolean deleted = file.delete();
                        log.info("삭제성공여부:{}",deleted);
                        log.info("삭제성공여부:{}",file.getPath());
                    } else {
                        log.info("파일 존재 하지않음 , 삭제 실패: {} " + file.getPath());
                    }
                });
       return "이미지파일 삭제";
    }
}
