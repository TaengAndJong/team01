package com.example.team01.admin.service;

import com.example.team01.admin.dao.AdminBookDao;
import com.example.team01.common.exception.book.BookException;
import com.example.team01.common.exception.book.BookNotFoundException;
import com.example.team01.common.exception.common.BusinessException;
import com.example.team01.utils.FileUtils;
import com.example.team01.utils.Pagination;
import com.example.team01.vo.AdminBookVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

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
        try {

            log.info("createBook book.file 새로추가된 도서 객체:{}", book.getBookImg()); // 1개 이상의 파일 객체 (파일 날데이터)
            //파일 유틸 클래스에서 이미지객체 존재 여부에 대해 검증하고 예외처리하기때문에 try - catch 구문 사용, 예외처리 없다면 사용하지 않아도 됨
            if (book.getBookImg() != null && !book.getBookImg().isEmpty()) {
                bookImgPath = fileUtils.saveFile(book.getBookImg(), "book");
              
                //반환된 bookImgPath 데이터베이스에 전달할 객체설정
                book.setBookImgPath(bookImgPath);
            } else {
                // 등록된 이미지가 없을 경우 noImg로 경로 설정 ==> 경로만 설정하고 noimg.png나 jp
                book.setBookImgPath(fileUtils.getDefaultImgPath());
            }

            //book 카테고리 공백 제거 ==> 데이터 문자열 정제
            if (book.getBookCateNm() != null && !book.getBookCateNm().isEmpty()) {
                String trimBookCateNm = book.getBookCateNm().trim()
                        .replaceAll("\\s*,\\s*", ",") // 콤마 양옆 공백 정리
                        .replaceAll("\\s+", " ");     // 불필요한 공백 정리;
                //정제된 카테고리 데이터 값 재설정
                book.setBookCateNm(trimBookCateNm);
            }
            log.info("book-------------------------------- 도서 등록된 경로  : {}",book);
            // 3. DB 등록 및 예외 처리
            cnt = dao.createBook(book);
            log.info("도서 등록 성공 여부(cnt): {}", cnt);
            // 저장이 안 된 상황이라면?
            if (cnt == 0) {
                throw new BusinessException("도서 정보가 저장되지 않았습니다. 입력값을 확인해주세요.");
            }
            return cnt; // 성공 시 1 반환
        }catch (DataIntegrityViolationException e){//파일 자료형용량초과 예외처리
            // DB 컬럼 길이 초과 등 데이터 무결성 제약 조건 위반 시 발생
            log.error("데이터 길이 초과 혹은 제약 조건 위반 발생: {}", e.getMessage());
            // 프론트엔드에 전달할 에러 메시지 (보안을 위해 SQL 정보는 숨김) ==> throw 로 컨트롤에서 예외 던지기
            throw new BusinessException("허용 가능한 파일 크기를 초과하였습니다.");
        }catch (Exception e) {
            // 그 외 예상치 못한 모든 에러 처리
            log.error("도서 등록 중 시스템 오류 발생: ", e);
            throw new BusinessException("도서 등록 중 오류가 발생했습니다. 관리자에게 문의하세요.");
        }

    }

    @Transactional
    @Override
    public void updateBook(AdminBookVO book) {
        // 도서수정처리 예외, 성공, 실패
        log.info("수정 updateBook-----------:{}",book);

        // 데이터베이스에 저장할 문자열 변수
        String bookImgPath="";

        //서버로 전송된 book 객체 검증
        if(book==null){
            throw new BookException("도서 정보가 존재하지 않습니다.");
        }

        // book에 해당하는 도서 db 조회
        AdminBookVO bookInfo =  dao.selectOneBook(book.getBookId());
        log.info("bookInfo---------도서 수정 updateBook:{}",bookInfo);

        //조회한 도서 객체가 없다면 null 예외처리
        if(bookInfo==null){
            throw new BookException("수정할 도서 정보가 없습니다.");
        }

        // 조회한 도서 객체가 있다면
        log.info("수정 book.file새로추가 된 이미지:{}, typeOf :{}", book.getBookImg(),  book.getBookImg().getClass());
        // 추가된 이미지가 있다면
        if(book.getBookImg() != null || !book.getBookImg().isEmpty()){

        }


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
        //존재하는 아이디 값만 넘겨서 삭제 성공이면  cnt = 성공한 개수로 반환

        //서버에 저장된 이미지 삭제하기
        for(Long bookId : existBookIds){
            AdminBookVO adminBookVO = dao.selectOneBook(bookId);
            log.info("도서 삭제 :{}", adminBookVO.getBookImgPath());
            
            //아니면 실제경로에서 파일삭제
            fileUtils.deleteFiles(adminBookVO.getBookImgPath(),"book");
        }

        //디비에서 레코드 삭제(delStatus로 관리해서 참조키관련 삭제관계 고려하지 않아도 됨 )
        cnt = dao.deleteBooks(existBookIds);
        log.info("delete cnt:{}",cnt);
        return cnt;
    }


}
