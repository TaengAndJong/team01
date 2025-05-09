package com.example.team01.book.service;

import com.example.team01.book.dao.BookDao;
import com.example.team01.common.exception.BookNotFoundException;
import com.example.team01.utils.FileUtils;
import com.example.team01.utils.Pagination;
import com.example.team01.vo.BookVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value; // 롬복 사용하면 안됨, inMemory에서 가져오려면 이 패키지 사용해야 함

import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;


//파일을 찾고 검증하는 로직은 비즈니스 로직,재사용성을 고려할 때도 서비스 계층이 더 적절
// Service에서만 Dao 객체 사용
@Slf4j
@RequiredArgsConstructor
@Service
public class BookServiceImple implements BookService{

    private final BookDao dao;


    @Autowired
    private FileUtils fileUtils; // FileUtils를 주입

    @Value("${file.upload-dir}")
    private String uploadPath;


    @Override
    public List<BookVO> getAllBooks(Pagination pagination) {
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
        List<BookVO> bookVOList = dao.selectAllBook(pagination);

       // log.info("서비스 bookVOList-----------:{}",bookVOList);

        List<String> bookImgePaths = new ArrayList<>();
        //실제이미지 파일 클라이언트로 전송하는 로직
        //1.데이터베이스에서 도서 객체 조회
        for(BookVO bookVO : bookVOList){
            //한 행의 레코드 하나씩 조회
            log.info("bookVO-----------------------:{}",bookVO);
            //2. bookImgPath "," 기준으로 자르고 배열반환
            String[] getBookImg= bookVO.getBookImgPath().split(",");

            if(bookVO.getBookImgPath()!=null || !bookImgePaths.isEmpty()){
                log.info("getBookImg ------------: {}",getBookImg);
            }
            /// 여기에서 bookVO객체 배열로변경해서 설정해야하는뎅
            bookVO.setBookImgList(Arrays.asList(getBookImg));
        }//end

        //5. 전체 객체 반환하기
        return bookVOList;
    }

    @Override
    public BookVO deTailBook(String bookId) {
        BookVO bookVO = dao.selectOneBook(bookId);
        // 텍스트 이미지경로 to ArrayList 이미지경로
        //bookImgPath  배열로 변경해서 넣어야함
        // 텍스트 이미지 split(",") 사용해서 문자 배열로 변경
        String[] bookImgPaths = bookVO.getBookImgPath().split(",");
        // bookVO의 bookImgList에 String 배열을 List 배열로 변경해 담아주기
        bookVO.setBookImgList(Arrays.asList(bookImgPaths));
        //데이터 반환
      return bookVO;
    }

    @Override
    public int createBook(BookVO book) throws FileNotFoundException {

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
    public int updateBook(BookVO book) throws FileNotFoundException {

        log.info("updateBook-----------:{}",book);


        int cnt =0;
        // 여기서부터 노이미지 파일 유틸에 들어가야함, 받을 파라미터는 BookVO book
        String bookImgPath=""; // 데이터베이스에 담을 파일명 담는 문자열 변수

        if(book != null) {
            log.info("updateBook 파일 객체도 담겨서 넘어옴:{}", book );
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
            cnt = dao.updateBook(book); // 처리가 되면 값이 1로 변경
            log.info("cnt------------------- : {} ", cnt);
            return cnt; // 1 반환
        }
        return cnt;
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
            BookVO bookVO = dao.selectOneBook(bookId);
            log.info("del img :{}",bookVO.getBookImgPath());
            //noImg가 포함되어있지 않으면
            if(!bookVO.getBookImgPath().contains("noImg")){
                //서버에서 삭제할 이미지파일 파라미터 넘겨주기
                fileUtils.deleteFiles(bookVO.getBookImgPath(),"book");
            }
        }
        //디비에서 레코드 삭제
        cnt = dao.deleteBooks(existBookIds);
        log.info("delete cnt:{}",cnt);
        return cnt;
    }

    @Override
    public List<BookVO> searchBook(String type, String field, String keyword) {

        List<BookVO> searchBookList = dao.searchBook(type,field,keyword);
        log.info("searchBookList-----------:{}",searchBookList);


        List<String> bookImgePaths = new ArrayList<>();
        //실제이미지 파일 클라이언트로 전송하는 로직
        //1.데이터베이스에서 도서 객체 조회
        for(BookVO bookVO : searchBookList){
            //한 행의 레코드 하나씩 조회
            log.info("bookVO-----------------------:{}",bookVO);
            //2. bookImgPath "," 기준으로 자르고 배열반환
            String[] getBookImg= bookVO.getBookImgPath().split(",");

            if(bookVO.getBookImgPath()!=null || !bookImgePaths.isEmpty()){
                log.info("getBookImg ------------: {}",getBookImg);
            }
            /// 여기에서 bookVO객체 배열로변경해서 설정해야하는뎅
            bookVO.setBookImgList(Arrays.asList(getBookImg));
        }//end

        //5. 전체 객체 반환하기
        return searchBookList;
    }

}
