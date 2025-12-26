package com.example.team01.index;


import com.example.team01.index.service.MainService;
import com.example.team01.menu.service.MenuService;
import com.example.team01.utils.FileUtils;
import com.example.team01.vo.AdminBookVO;
import com.example.team01.vo.BookVO;
import com.example.team01.vo.MenuVO;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;
import java.util.stream.Collectors;

// api 는 localhost:port/api
// getMapping 은 localhost:port/api 다음의 경로 /test
//localhost:port/api/test


@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/")
public class IndexController {

    private final MainService mainService;
    private final FileUtils fileUtils;

    //getMapping index 페이지 명시적으로 해주지 않으면 데이터 전송에 충돌 생길 수 있음!
    @GetMapping()
    public ResponseEntity<?> index() {
        //기본파라미터 매칭 안될때 
        log.info("index 기본메서드");
        return ResponseEntity.ok(" 기본 인덱스");
    }

       //getMapping
    @GetMapping(params="bookSlide") // 동일 경로여도 옵션에따라 경로가 다르게 지정 됨
    public ResponseEntity<?> getBooksMapping(@RequestParam(required = false) String bookSlide
    , HttpServletRequest request) {

        log.info("mainController---books:{}", bookSlide);
        //슬라이드에 들어갈 데이터 가져오기
        Map<String,Object> data = mainService.getPartOfBooks(); //서비스에서 데이터 가져오기
        log.info("mainController---bookSlide:{}", data.get("bookSlide"));
        log.info("mainController---recmSlide:{}", data.get("recomSlide"));
        log.info("mainController---popularSlide:{}", data.get("popularSlide"));

        //bookImgPath 변경해주기
        //bookSlide 형태는 배열을 객체 ( {ebook: [..] , ... , national:[..]} ==> entrySet으로 순회
        // bookSlide: Map<String, Object> 형태

        //형변환해주기
        Map<String, List<BookVO>> bookObjs = (Map<String, List<BookVO>>) data.get("bookSlide");
        for (Map.Entry<String, List<BookVO>> entry : bookObjs.entrySet()) {
            String category = entry.getKey();
            List<BookVO> bookList = entry.getValue();
            // 각 BookVO의 bookImgPath 변경해서 bookImgList에 담아주기
            for (BookVO bookvo : bookList) {
            log.info("bookVO --- :{}",bookvo);
                // BookVO 이미지Path를 분리해서 담아줄 ImgliSt 배열 변수 필요
                List<String> imgArray = new ArrayList<>(); // 가변배열 리스트이면서, 값이 없어도 존재해야함 ( npx 방지 )
                if(bookvo.getBookImgPath() != null && !bookvo.getBookImgPath().isEmpty()){
                    imgArray =  new ArrayList<>(
                            Arrays.asList(
                                    bookvo.getBookImgPath().split(",") //String [] 배열로 반환
                            )//Arrays.asList() 는 배열을 List로 => 고정크기 List
                    );// new ArrayList로 수정 가능한 새로운 가변 List 생성

                }
                //for문 종료
                // admingbookVO bookImgList에 담아주기
                bookvo.setBookImgList(imgArray);
            }
            log.info("bookList------------ 인데스 컨트롤러 '{}' 이미지 경로 변경 완료", bookList);

            // 변경된 리스트 다시 세팅 (사실 entry.getValue()는 이미 참조이므로 생략 가능)
            entry.setValue(bookList);

            log.info("카테고리 '{}' 이미지 경로 변경 완료", category);
        }


        log.info("mainController-- 북슬라이드- 객체순환완료 ");
        //형변환 해주기
        List<BookVO> recomList = (List<BookVO>) data.get("recomSlide");
        List<BookVO> popularList = (List<BookVO>) data.get("popularSlide");
        log.info("mainController-- 추천,인기 슬라이드- 객체순환시작");
        //recomSlide 는 배열 ==> map으로 순회
        recomList.stream().map(bookVO->{//map함수를 통해 객체를 순회하면서 이미지의 경로를 변경
            List<String> imgArray = new ArrayList<>();
            if(bookVO.getBookImgPath() != null && !bookVO.getBookImgPath().isEmpty()){
                imgArray =  new ArrayList<>(
                        Arrays.asList(
                                bookVO.getBookImgPath().split(",") //String [] 배열로 반환
                        )//Arrays.asList() 는 배열을 List로 => 고정크기 List
                );// new ArrayList로 수정 가능한 새로운 가변 List 생성

            }
            //for문 종료
            // admingbookVO bookImgList에 담아주기
            bookVO.setBookImgList(imgArray);
            log.info("mainController---recomList변경된 데이터:{}", bookVO);
            return bookVO;
        }).collect(Collectors.toList());

        //popularSlide도 배열 ==> map으로 순회
        popularList.stream().map(bookVO->{//map함수를 통해 객체를 순회하면서 이미지의 경로를 변경

            List<String> imgArray = new ArrayList<>();
            if(bookVO.getBookImgPath() != null && !bookVO.getBookImgPath().isEmpty()){
                imgArray =  new ArrayList<>(
                        Arrays.asList(
                                bookVO.getBookImgPath().split(",") //String [] 배열로 반환
                        )//Arrays.asList() 는 배열을 List로 => 고정크기 List
                );// new ArrayList로 수정 가능한 새로운 가변 List 생성

            }
            //for문 종료
            // admingbookVO bookImgList에 담아주기
            bookVO.setBookImgList(imgArray);

            return bookVO;
        }).collect(Collectors.toList());


        log.info("mainController---변경된 데이터:{}", data);


        return ResponseEntity.ok(data); // 클라이언트로 응답을 보내기
    }


}
