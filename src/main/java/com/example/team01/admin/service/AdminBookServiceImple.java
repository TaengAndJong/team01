package com.example.team01.admin.service;

import com.example.team01.admin.dao.AdminBookDao;
import com.example.team01.book.dao.BookDao;
import com.example.team01.common.exception.BookNotFoundException;
import com.example.team01.utils.FileUtils;
import com.example.team01.utils.Pagination;
import com.example.team01.vo.AdminBookVO;
import com.example.team01.vo.BookVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;


@Slf4j
@Transactional
@RequiredArgsConstructor
@Service
public class AdminBookServiceImple implements AdminBookService {

    private final AdminBookDao dao;


    @Autowired
    private FileUtils fileUtils; // FileUtils를 주입

    @Value("${file.upload-dir}")
    private String uploadPath;


    @Override
    public List<AdminBookVO> getAllBooks(Pagination pagination) {
        log.info("컨트롤러에서 받아온 파라미터 pagination:{}", pagination.toString());
        //전체 데이터 레코드 조회해오기
        int total = dao.totalRecord(pagination);
        log.info("서비스 total record-----------:{}", total);
        // 전체 데이터 페이지네이션 멤버변수 값 설정
        pagination.setTotalRecord(total);
        log.info("서비스 pagination 총 레코드 수 -----------:{}", pagination.getTotalRecord());
        log.info("서비스 pagination 총 getCurrentPage 수 -----------:{}", pagination.getCurrentPage());
        //startRow && endRow 설정
        pagination.setLimitRows(pagination.getCurrentPage());
        log.info("컨트롤러에서 받아온 파라미터 pagination2222:{}", pagination.toString());

        // 조회된 전체 데이터의 행의 개수 조회
        List<AdminBookVO> adminBookVOList = dao.selectAllBook(pagination);

        log.info("서비스 adminBookVOList-----------:{}",adminBookVOList);

        List<String> bookImgePaths = new ArrayList<>();
        //실제이미지 파일 클라이언트로 전송하는 로직
        //1.데이터베이스에서 도서 객체 조회
        for(AdminBookVO adminBookVO : adminBookVOList){
            //한 행의 레코드 하나씩 조회
            log.info("bookVO-----------------------:{}", adminBookVO);
            //bookImgPath가 null이 아니고, 비어 있지 않을 때만 실행
            String bookImgPath = adminBookVO.getBookImgPath();

            if(adminBookVO.getBookImgPath()!=null && !bookImgePaths.isEmpty()){
                //2.값이 있을 경우 split로  bookImgPath "," 기준으로 자르고 배열반환
                String[] getBookImg= adminBookVO.getBookImgPath().split(",");
                log.info("getBookImg ------------: {}",getBookImg);
                /// 여기에서 bookVO객체 배열로변경해서 설정
                adminBookVO.setBookImgList(Arrays.asList(getBookImg));
            }else{
                // null 또는 빈 문자열이면 빈 리스트로 설정 => 빈값을 경우 검증해서 빈배열반환
                adminBookVO.setBookImgList(Collections.emptyList());
            }

        }//end

        //5. 전체 객체 반환하기
        return adminBookVOList;
    }

    @Override
    public AdminBookVO deTailBook(String bookId) {
        AdminBookVO adminBookVO = dao.selectOneBook(bookId);

        log.info("detailBook--modify:{}", adminBookVO);

        // 텍스트 이미지경로 to ArrayList 이미지경로
        //bookImgPath  배열로 변경해서 넣어야함
        // 텍스트 이미지 split(",") 사용해서 문자 배열로 변경
        String[] bookImgPaths = adminBookVO.getBookImgPath().split(",");
        // bookVO의 bookImgList에 String 배열을 List 배열로 변경해 담아주기
        adminBookVO.setBookImgList(Arrays.asList(bookImgPaths));

        log.info("detailBook--modify--- getbookImgList:{}", adminBookVO.getBookImgList());
        //데이터 반환
        return adminBookVO;
    }

    @Override
    public int createBook(AdminBookVO book) {

        log.info("createBook-----------:{}",book);


        int cnt =0;
        // 여기서부터 노이미지 파일 유틸에 들어가야함, 받을 파라미터는 BookVO book
        String bookImgPath=""; // 데이터베이스에 담을 파일명 담는 문자열 변수

        if(book != null) {
            log.info("createBook에 파일 객체도 담겨서 넘어옴:{}", book );
            log.info("book.file?????:{}", book.getBookImg()); // 1개 이상의 파일 객체 (파일 날데이터)

            //파일 유틸 클래스에서 이미지객체 존재 여부에 대해 검증하고 예외처리하기때문에 try - catch 구문 사용, 예외처리 없다면 사용하지 않아도 된다고 함
            try{
                bookImgPath = fileUtils.saveFile(book.getBookImg(),"book");
                log.info("bookImgPath--------------------- 파일 유틸 반환값 확인: {}",bookImgPath);

                //반환된 bookImgPath 데이터베이스에 전달할 객체설정
                book.setBookImgPath(bookImgPath);

            }catch (FileNotFoundException e){
                log.error("파일이 존재하지 않음: {}", e.getMessage());
                // 기본 이미지 경로로 대체하거나 에러 응답 처리
                book.setBookImgPath(fileUtils.getDefaultImgPath());

            } catch (Exception e){
                log.info("파일 저장 중  Exception :{}",e.getMessage());
                log.error("파일 저장 중 Exception 발생", e);
                e.printStackTrace();
                // 기본 이미지 경로로 대체하거나 에러 응답 처리
                book.setBookImgPath(fileUtils.getDefaultImgPath());
            }


            //파일 유틸 끝
            log.info(" 생성 시 객체 확인 - 파일객체 확인하기 -------------------------------------:{} ",book);

            //공통처리부분
            cnt = dao.createBook(book); // 처리가 되면 값이 1로 변경
            log.info("cnt------------------- : {} ", cnt);
            return cnt; // 1 반환
        }
        return cnt;
    }

    @Override
    public int updateBook(AdminBookVO book) {

        log.info("updateBook-----------:{}",book);

        int cnt =0;
        // 여기서부터 노이미지 파일 유틸에 들어가야함, 받을 파라미터는 BookVO book
        String bookImgPath=""; // 데이터베이스에 담을 파일명 담는 문자열 변수

        if(book != null) { // 도서 객체가 있는지 확인
            log.info("updateBook 파일 객체도 담겨서 넘어옴:{}", book );
            log.info("book.file?????:{}", book.getBookImg()); // 1개 이상의 파일 객체 (파일 날데이터)

            //파일 유틸 클래스에서 이미지객체 존재 여부에 대해 검증하고 예외처리하기때문에
            // try - catch 구문 사용, 예외처리 없다면 사용하지 않아도 됨
            try{
                // 도서 이미지가 존재 새로 추가되어 비어있지 않은 경우
                if(book.getBookImg() != null && !book.getBookImg().isEmpty()){
                    bookImgPath = fileUtils.saveFile(book.getBookImg(),"book");
                    log.info("bookImgPath--------------------- 파일 유틸 반환값 확인: {}",bookImgPath);
                    //반환된 bookImgPath 데이터베이스에 전달할 객체설정
                    book.setBookImgPath(bookImgPath);
                }else{
                    // 새로 추가된 이미지가 없는 경우
                    log.info("bookImgPath--------------------- 기존이미지패스: {}",book.getBookImgPath());
                }

            } catch (Exception e){
                log.info("파일 저장 중  Exception :{}",e.getMessage());
                log.error("파일 저장 중 Exception 발생", e);
                e.printStackTrace();
                // 기본 이미지 경로로 대체하거나 에러 응답 처리 ( 기존이미지 유지)
                book.setBookImgPath(fileUtils.getDefaultImgPath());
            }
            //파일 유틸 끝
            log.info(" 도서수정 후 객체 확인 - 파일객체 확인하기 -------------------------------------:{} ",book);

            //공통처리부분
            cnt = dao.updateBook(book); // 처리가 되면 값이 1로 변경
            log.info("도서수정 완료 cnt------------------- : {} ", cnt);
            return cnt; // 1 반환
        }
        return cnt; // false 일경우 0 반환
    }

    @Override
    public int deleteBooks(List<String> bookIds) {
        log.info("서비스구현체 파라미터오나?-----bookIds:{}",bookIds);
        int cnt;
        //삭제할 아이디데이터 조회
        List<String> existBookIds = dao.existBooks(bookIds);
        log.info("existBookIds-----:{}",existBookIds);
        //삭제할 아이디데이터와 클라이언트가 삭제하려고 보낸 데이터의 일치여부판단
        if(existBookIds.size() != bookIds.size()){
            log.info("삭제할 데이터 개수 일치하지 않음-----:{},{}",existBookIds.size(),bookIds.size());
            //일치하지 않는 도서 데이터 펼쳐서 필터 후 하나로 묶어서 리스트로 만들기
            List<String> missingIds = bookIds.stream()
                    .filter(bookId -> !existBookIds.contains(bookId)).collect(Collectors.toList());
            //예외처리
            throw new BookNotFoundException("존재하지 않는 도서 ID ",missingIds);
        }
        //존재하는 아이디 값만 넘겨서 삭제성공이면  cnt = 성공한 개수로 반환


        //서버에 저장된 이미지 삭제하기
        for(String bookId : existBookIds){
            AdminBookVO adminBookVO = dao.selectOneBook(bookId);
            log.info("del img :{}", adminBookVO.getBookImgPath());
            //noImg가 포함되어있지 않으면
            if(!adminBookVO.getBookImgPath().contains("noImg")){
                //서버에서 삭제할 이미지파일 파라미터 넘겨주기
                fileUtils.deleteFiles(adminBookVO.getBookImgPath(),"book");
            }
        }
        //디비에서 레코드 삭제
        cnt = dao.deleteBooks(existBookIds);
        log.info("delete cnt:{}",cnt);
        return cnt;
    }



//    @Override
//    public List<BookVO> searchBook(String type, String field, String keyword) {
//
//        List<BookVO> searchBookList = dao.searchBook(type,field,keyword);
//        log.info("searchBookList-----------:{}",searchBookList);
//
//
//        List<String> bookImgePaths = new ArrayList<>();
//        //실제이미지 파일 클라이언트로 전송하는 로직
//        //1.데이터베이스에서 도서 객체 조회
//        for(BookVO bookVO : searchBookList){
//            //한 행의 레코드 하나씩 조회
//            log.info("bookVO-----------------------:{}",bookVO);
//            //2. bookImgPath "," 기준으로 자르고 배열반환
//            String[] getBookImg= bookVO.getBookImgPath().split(",");
//
//            if(bookVO.getBookImgPath()!=null || !bookImgePaths.isEmpty()){
//                log.info("getBookImg ------------: {}",getBookImg);
//            }
//            /// 여기에서 bookVO객체 배열로변경해서 설정해야하는뎅
//            bookVO.setBookImgList(Arrays.asList(getBookImg));
//        }//end
//
//        //5. 전체 객체 반환하기
//        return searchBookList;
//    }
}
