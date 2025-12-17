package com.example.team01.admin.service;

import com.example.team01.admin.dao.AdminBookDao;
import com.example.team01.common.exception.BookNotFoundException;
import com.example.team01.utils.FileUtils;
import com.example.team01.utils.Pagination;
import com.example.team01.vo.AdminBookVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        // 전체 데이터 페이지네이션 멤버변수 값 설정
        pagination.setTotalRecord(total);

        //startRow && endRow 설정
        pagination.setLimitRows();

        log.info("컨트롤러에서 받아온 파라미터 pagination2222:{}", pagination.toString());

        // 조회된 전체 데이터의 행의 개수 조회
        List<AdminBookVO> adminBookVOList = dao.selectAllBook(pagination);

        List<String> bookImgePaths = new ArrayList<>();
        //실제이미지 파일 클라이언트로 전송하는 로직
        //1.데이터베이스에서 도서 객체 조회
        for(AdminBookVO adminBookVO : adminBookVOList){
            //한 행의 레코드 하나씩 조회

            //bookImgPath가 null이 아니고, 비어 있지 않을 때만 실행
            String bookImgPath = adminBookVO.getBookImgPath();

            if(adminBookVO.getBookImgPath()!=null && !bookImgePaths.isEmpty()){
                //2.값이 있을 경우 split로  bookImgPath "," 기준으로 자르고 배열반환
                String[] getBookImg= adminBookVO.getBookImgPath().split(",");

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
    public AdminBookVO deTailBook(Long bookId) {
        //psql 수정후 bookId를 못받아오고 있음 ==>
        // mapper.xml에서  insert 시 vo.bookId를 설정해주는 useGeneratedKeys="true" keyProperty="bookId" 작성 필요
        log.info("detailBook--bookId:{}", bookId);
        AdminBookVO adminBookVO = dao.selectOneBook(bookId);

        log.info("detailBook--modify:{}", adminBookVO);

        // 텍스트 이미지경로 to ArrayList 이미지경로
        //bookImgPath  배열로 변경해서 넣어야함
        // 텍스트 이미지 split(",") 사용해서 문자 배열로 변경
        String[] bookImgPaths = adminBookVO.getBookImgPath().split(",");
        // bookVO의 bookImgList에 String 배열을 List 배열로 변경해 담아주기
        adminBookVO.setBookImgList(Arrays.asList(bookImgPaths));
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
            log.info("createBook book.file 새로추가된 도서 객체:{}", book.getBookImg()); // 1개 이상의 파일 객체 (파일 날데이터)

            //파일 유틸 클래스에서 이미지객체 존재 여부에 대해 검증하고 예외처리하기때문에 try - catch 구문 사용, 예외처리 없다면 사용하지 않아도 됨
                if(book.getBookImg() != null && !book.getBookImg().isEmpty()){
                    bookImgPath = fileUtils.saveFile(book.getBookImg(),"book");
                    log.info("bookImgPath--------------------- 파일 유틸 반환값 확인: {}",bookImgPath);
                    //반환된 bookImgPath 데이터베이스에 전달할 객체설정
                    book.setBookImgPath(bookImgPath);
                }else{
                    // 등록된 이미지가 없을 경우 noImg로 경로 설정
                    book.setBookImgPath(fileUtils.getDefaultImgPath());
                }
            //book 카테고리 공백 제거 ==> 데이터 문자열 정제
            if(book.getBookCateNm() !=null && !book.getBookCateNm().isEmpty()){
                String trimBookCateNm=book.getBookCateNm().trim()
                        .replaceAll("\\s*,\\s*", ",") // 콤마 양옆 공백 정리
                        .replaceAll("\\s+", " ");     // 불필요한 공백 정리;
                //정제된 카테고리 데이터 값 재설정
                book.setBookCateNm(trimBookCateNm);
            }
            //파일 유틸 끝
            log.info(" 도서 등록 객체확인 -------------------------------------:{} ",book);
            log.info(" 도서 등록 이미지객체확인 -------------------------------------:{} ",book.getBookCateNm());
            log.info(" 도서 등록 이미지객체확인 -------------------------------------:{} ",book.getBookImgPath());

            //공통처리부분
            cnt = dao.createBook(book); // 처리가 되면 값이 1로 변경
            log.info("도서 등록 cnt : {} ", cnt);
            return cnt; // 1 반환
        }
        return cnt;
    }

    @Override
    public int updateBook(AdminBookVO book) {

        log.info("수정 updateBook-----------:{}",book);

        int cnt =0;
        // 여기서부터 노이미지 파일 유틸에 들어가야함, 받을 파라미터는 BookVO book
        String bookImgPath=""; // 데이터베이스에 담을 파일명 담는 문자열 변수

        if(book != null) { // 도서 객체가 있는지 확인
            log.info("updateBook 파일 객체도 담겨서 넘어옴:{}", book );
            log.info("수정 updateBook book.file새로추가된:{}", book.getBookImg()); // 1개 이상의 파일 객체 (파일 날데이터)
            //파일 유틸 클래스에서 이미지객체 존재 여부에 대해 검증하고 예외처리하기때문에
            // try - catch 구문 사용, 예외처리 없다면 사용하지 않아도 됨

                // 도서 이미지가 존재 새로 추가되어 비어있지 않은 경우
                if(book.getBookImg() != null && !book.getBookImg().isEmpty()){
                    //들어온 파일을 서버에 저장하는역할 ==> 내부에서 빈값이면 noImg로 대체해서 반환해줌
                    bookImgPath = fileUtils.saveFile(book.getBookImg(),"book");
                    log.info("실서버에 저장된 파일 객체 값: {}",bookImgPath);

                    //기존 bookImgPath가 있을경우 결합 후 설정 필요
                    String updateBookImgPath="";
                    //1.기존  해당 등록도서의 이전 bookImgPath 조회해오기
                     String preBookImgPath= dao.selectOneBook(book.getBookId()).getBookImgPath();
                     log.info("이전 도서 이미지 경로 존재 여부 확인 : {} ",preBookImgPath);

                     //preBookImgPath가 이미 noImg를 포함하고 있다면 조건 분기
                    if(preBookImgPath == null && preBookImgPath.trim().isEmpty()){
                        log.info("업데이트 북이미지 경로 생성 : 혹시모를 null값 방어코드 ");
                        //디비 조회해온 이미지가 없고, 빈값이면 가져온 이미지로 대체
                        updateBookImgPath = bookImgPath;
                    }else if(preBookImgPath.toLowerCase().contains("noimg")){
                        log.info("업데이트 북이미지 경로 생성 : 노이미지 >> 여기까지 조건문이 들어오나 ?  ");
                        //대소문자 구분 없이 'noimg' 포함되어 있으면 새 경로로 대체(노이미지 삭제)
                        updateBookImgPath = bookImgPath;
                    }else{
                        log.info("업데이트 북이미지 경로 생성 bookImgPath : {} ",bookImgPath);
                        //디비조회한 이미지가 noimg가 아니고, 이전 값이 존재하는 경우  BookImgPath 경로와 다시 결합 후 반환
                        updateBookImgPath = String.join(",",preBookImgPath,bookImgPath);
                    }
                    log.info("최종 이미지 경로 updateBookImgPath : {} ",updateBookImgPath);
                    //반환된 bookImgPath 데이터베이스에 전달할 객체설정
                    book.setBookImgPath(updateBookImgPath);
                }else{
                    // 새로 추가된 이미지가 없는 경우 ( 기존 도서 일부 또는 전체 삭제[bookImgPath = 빈값])
                    log.info("새로 추가되지 않을 경우, 일부 삭제만 했을 경우 , 빈값일 경우도 여기서 처리 : {}",book.getBookImgPath());
                    String preBookImgPath = book.getBookImgPath();
                   if(preBookImgPath != null && !preBookImgPath.isEmpty()) { // 이미지를 전체 삭제했을 경우
                       log.info("새로 추가되지 않을 경우, 일부 삭제만 했을 경우 처리 블록 : {}",preBookImgPath);
                       //기존 bookImgPath 재설정
                       book.setBookImgPath(preBookImgPath);
                       log.info("새로 추가되지 않을 경우, 일부 삭제만 했을 경우: {}",book.getBookImgPath());
                   }else{
                       log.info("전체삭제: {}",book.getBookImgPath());
                       book.setBookImgPath(fileUtils.getDefaultImgPath());
                       log.info("전체삭제 했을 (빈값 일)경우 처리 블록  noImg처리: {}",book.getBookImgPath());
                   }
                }


            //book 카테고리 공백 제거 ==> 데이터 문자열 정제
            if(book.getBookCateNm() !=null && !book.getBookCateNm().isEmpty()){
                String trimBookCateNm=book.getBookCateNm().trim()
                        .replaceAll("\\s*,\\s*", ",") // 콤마 양옆 공백 정리
                        .replaceAll("\\s+", " ");     // 불필요한 공백 정리;
                //정제된 카테고리 데이터 값 재설정
                book.setBookCateNm(trimBookCateNm);
            }
            //파일 유틸 끝
            log.info(" 도서수정 후 객체 확인 - 파일객체 확인하기 전체:{} ",book);
            log.info(" 도서수정 후 객체 확인 - 파일객체 확인하기 bookImgPath:{} ",book.getBookImgPath());

            //공통처리부분
            cnt = dao.updateBook(book); // 처리가 되면 값이 1로 변경
            log.info("도서수정완료 cnt------------------- : {} ", cnt);
            return cnt; // 1 반환
        }
        return cnt; // false 일경우 0 반환
    }

    @Override
    public int deleteBooks(List<Long> bookIds) {
        log.info("서비스구현체 파라미터오나?-----bookIds:{}",bookIds);
        int cnt;
        //삭제할 아이디데이터 조회
        List<Long> existBookIds = dao.existBooks(bookIds);
        log.info("existBookIds-----:{}",existBookIds);
        //삭제할 아이디데이터와 클라이언트가 삭제하려고 보낸 데이터의 일치여부판단
        if(existBookIds.size() != bookIds.size()){
            log.info("삭제할 데이터 개수 일치하지 않음-----:{},{}",existBookIds.size(),bookIds.size());
            //일치하지 않는 도서 데이터 펼쳐서 필터 후 하나로 묶어서 리스트로 만들기 ( Long => String  변환)
            List<String> missingIds = bookIds.stream()
                    .filter(bookId -> !existBookIds.contains(bookId))
                    .map(String::valueOf)
                    .collect(Collectors.toList());
            //예외처리
            throw new BookNotFoundException("존재하지 않는 도서 ID ",missingIds);
        }
        //존재하는 아이디 값만 넘겨서 삭제성공이면  cnt = 성공한 개수로 반환

        //서버에 저장된 이미지 삭제하기
        for(Long bookId : existBookIds){
            AdminBookVO adminBookVO = dao.selectOneBook(bookId);
            log.info("도서 삭제 :{}", adminBookVO.getBookImgPath());
            //noImg가 포함되어있지 않으면
            if(!adminBookVO.getBookImgPath().contains("noImg")){

                //서버에서 삭제할 이미지파일 파라미터 넘겨주기(실제파일 저장경로에서 삭제=물리삭제)
                fileUtils.deleteFiles(adminBookVO.getBookImgPath(),"book");

            }else{
                log.info("NOImg 인 경우:{}", adminBookVO.getBookImgPath());
                // noImg가 포함된 경우 실제 파일 삭제는 없음
                //DB 상 bookImgPath를 기본 이미지 경로로 갱신 (일관성 유지)
            }
        }

        //디비에서 레코드 삭제(delStatus로 로 관리해서 참조키관련 삭제관계 고려하지 않아도 됨 )
        cnt = dao.deleteBooks(existBookIds);
        log.info("delete cnt:{}",cnt);
        return cnt;
    }


}
