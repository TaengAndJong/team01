package com.example.team01.admin.service;

import com.example.team01.admin.dao.AdminBookDao;
import com.example.team01.book.dao.BookImageDao;
import com.example.team01.common.exception.book.BookException;
import com.example.team01.common.exception.book.BookNotFoundException;
import com.example.team01.common.exception.common.BusinessException;
import com.example.team01.utils.FileUtils;
import com.example.team01.utils.Pagination;
import com.example.team01.vo.AdminBookVO;
import com.example.team01.vo.BookImageVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;


@Slf4j
@Transactional
@RequiredArgsConstructor
@Service
public class AdminBookServiceImple implements AdminBookService {

    private final AdminBookDao adminBookDao;
    private final BookImageDao bookImageDao;

    @Autowired
    private FileUtils fileUtils; // FileUtils를 주입

    @Value("${file.upload-dir}")
    private String uploadPath;


    @Override
    public List<AdminBookVO> getAllBooks(Pagination pagination) {
        log.info("컨트롤러에서 받아온 파라미터 pagination:{}", pagination.toString());
        //전체 데이터 레코드 조회해오기
        int total = adminBookDao.totalRecord(pagination);
        // 전체 데이터 페이지네이션 멤버변수 값 설정
        pagination.setTotalRecord(total);
        //startRow && endRow 설정
        pagination.setLimitRows();

        log.info("컨트롤러에서 받아온 파라미터 pagination2222:{}", pagination.toString());

        // 조회된 전체 데이터의 행의 개수 조회
        List<AdminBookVO> allBookList = adminBookDao.selectAllBook(pagination);

       log.info("도서 목록조회 allBookList:{}", allBookList);


        //5. 전체 객체 반환하기
        return allBookList;
    }

    @Override
    public AdminBookVO deTailBook(Long bookId) {
        //psql 수정후 bookId를 못받아오고 있음 ==>
        // mapper.xml에서  insert 시 vo.bookId를 설정해주는 useGeneratedKeys="true" keyProperty="bookId" 작성 필요
        log.info("detailBook--bookId:{}", bookId);
        AdminBookVO adminBookVO = adminBookDao.selectOneBook(bookId);

        log.info("detailBook--modify:{}", adminBookVO);

        // 텍스트 이미지경로 to ArrayList 이미지경로
        //bookImgPath  배열로 변경해서 넣어야함
        // 텍스트 이미지 split(",") 사용해서 문자 배열로 변경
//        String[] bookImgPaths = adminBookVO.getBookImgPath().split(",");
//        // bookVO의 bookImgList에 String 배열을 List 배열로 변경해 담아주기
//        adminBookVO.setBookImgList(Arrays.asList(bookImgPaths));
        //데이터 반환
        return adminBookVO;
    }

    @Override
    @Transactional
    public void  createBook(AdminBookVO book, List<MultipartFile> images) {

        log.info("createBook-----------book:{}",book);
        log.info("createBook-----------images:{}",images);
        //등록파라미터 null검증
        if(book == null) {
            throw new BookException("요청받은 도서 정보가 없음");
        }

        //요청받은 도서정보가 있으면 먼저 데이터베이스에 저장
        int cnt = adminBookDao.createBook(book);
        
        // 등록이 되지 않았을 때 예외 던지기
        if (cnt == 0) {
            throw new BookException("도서 정보가 저장되지 않았습니다.");
        }


        //그 다음 파일 객체 저장 ( 이미지 파일이 없는 경우, noimage로 대체 / 대표이미지 isMain설정 필요)
        List<String> saveFilePaths = new ArrayList<>();

        log.info("saveFilePaths------------------: {}", saveFilePaths);
        try {
            // 파일을 경로에 저장하고, 디비에 저장할 파일명 리스트를 반환
            saveFilePaths = fileUtils.saveFile(images,"book");// muntifile 객체와 생성할 폴더명 작성
            // saveFilePaths의 객체는 이미 존재하고, 리스트의 빈 값일 경우 확인 :
            if(saveFilePaths.isEmpty()){
                // 리스트가 비어있다면 노이미지 경로를 담아 줘야 함
                saveFilePaths.add(fileUtils.getDefaultImgPath()); // 노이미지 문자열 경로 반환
            }

            // 먼저 insert된 bookId 가져오기
            Long bookId = book.getBookId();
            log.info("도서등록 bookId ---- :{}", bookId);
            if (bookId == null) {
                throw new BookException("도서 ID 생성 실패");
            }

            //메인 이미지 설정( 첫 번째에만 isMain 'Y' 나머지 'N' ) 과 bookImage 테이블에 각각의 이미지 insert
            for(int i=0; i < saveFilePaths.size(); i++){
                BookImageVO image = new BookImageVO();
                image.setBookId(bookId); // insert 된 도서 아이디값 설정
                image.setImagePath(saveFilePaths.get(i)); // i번째에 해당하는 경로 설정
                image.setIsMain(i == 0 ? "Y":"N"); // 메인 이미지 설정

                log.info("bookImage - 1건씩 insert할 객체: {} ", image);
                //insert BookImg
                int imageCnt = bookImageDao.insertBookImages(image);

                if (imageCnt == 0) {
                    throw new BookException("도서 이미지 저장 실패");
                }
            }//for end

        }catch (Exception e){

            if (!saveFilePaths.isEmpty()) {
               // 저장된 파일 삭제
               // fileUtils.deleteFiles(saveFilePaths);
            }

            throw e; // 다시 던져야 트랜잭션 롤백됨
        }
    //도서 등록 insert 끝
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
        AdminBookVO bookInfo =  adminBookDao.selectOneBook(book.getBookId());
        log.info("bookInfo---------도서 수정 updateBook:{}",bookInfo);

        //조회한 도서 객체가 없다면 null 예외처리
        if(bookInfo==null){
            throw new BookException("수정할 도서 정보가 없습니다.");
        }

//        // 조회한 도서 객체가 있다면
//        log.info("수정 book.file새로추가 된 이미지:{}, typeOf :{}", book.getBookImg(),  book.getBookImg().getClass());
//        // 추가된 이미지가 있다면
//        if(book.getBookImg() != null || !book.getBookImg().isEmpty()){
//            log.info("getbookImg notNull:{}", book.getBookImg());
//        }
//
//        log.info("getbookImg null:{}", book.getBookImg());
    }


    //단건삭제 와 다건 삭제는 분리해서 메서드 처리해야함
    @Override
    public void deleteBooks(List<Long> bookIds) {
        log.info("서비스구현체 파라미터오나?-----bookIds:{}",bookIds);
        int cnt;
        //삭제할 아이디데이터 조회
        List<Long> existBookIds = adminBookDao.existBooks(bookIds);
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
//        for(Long bookId : existBookIds){
//            AdminBookVO adminBookVO = dao.selectOneBook(bookId);
//            log.info("도서 삭제 :{}", adminBookVO.getBookImgPath());
//
//            //아니면 실제경로에서 파일삭제
//            fileUtils.deleteFiles(adminBookVO.getBookImgPath(),"book");
//        }

        //디비에서 레코드 삭제(delStatus로 관리해서 참조키관련 삭제관계 고려하지 않아도 됨 )
        cnt = adminBookDao.deleteBooks(existBookIds);
        log.info("delete cnt:{}",cnt);

    }


}
