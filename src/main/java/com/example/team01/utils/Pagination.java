package com.example.team01.utils;

//private 은닉화, 캡슐화
// final 데이터의 불변성

import com.example.team01.vo.SearchConditionVO;
import lombok.Getter;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;

import java.util.LinkedHashMap;
import java.util.Map;

//오라클 버전 확인하고 작업하기 11버전 또는 12버전이상!
// 검색어 필터가 있다면 검색어 관련 코드도 작성해 주어야 됨
// 개별적으로 setter를 작성하는 이유는 필드(멤버변수)보호, 안정성

@Getter
@ToString
@Slf4j
public class Pagination {

    private int currentPage;//현재 페이지
    private int pageSize;// 보여줄 페이지 개수
    private int startRow;    // 조회 시작 행 번호
    private int endRow;      // 조회 끝 행 번호
    private int totalRecord; // 필터가 적용된 데이터베이스의 전체 데이터(행의)개수
    private int totalPages;// 페이지 버튼 UI 사용할 개수
    private String clientId;// 로그인한 유저일경우




    //생성자는 멤버변수를 초기화하기위해 사용!( 멤버변수 값 설정_) 생성자는 클래스명과 동일
    public Pagination(int currentPage, int pageSize) {

        this.currentPage =  (currentPage <= 0) ? 1 : currentPage;
        this.pageSize = (pageSize <= 0 || pageSize > 100) ? 10 : pageSize; // 데이터 100개 이상 요청 못하게 제한
        log.info("currentPage 데이터:{},pageSize 데이터:{}",currentPage,pageSize);
    }

    //검색 상태관리 변수
    private SearchConditionVO simpleCondition;
    //1개의 검색 조건 필터와 1개의 키워드일 경우 ( select + input[type="text"])
    public void setSimpleCondition(SearchConditionVO simpleCondition) {
        this.simpleCondition = simpleCondition;
        log.info("simpleCondition : {}",simpleCondition);
    }
    // 1개 이상의 검색조건과 1개의 키워드일 경우 (다중조건 또는 동적 필터일 경우 ==> select + select + input[type="text"])
    private Map<String, Object> detailCondition = new LinkedHashMap<>();

    // detailCondition에 검색필터객체를 추가해주는 메서드
    public void addDetailCondition(String key, Object value) {
        detailCondition.put(key, value);
        log.info("key : {},value:{}",key,value);
    }

    //다중조건을 담는 detailCondition Map객체 설정 메서드
    public void setDetailCondition(Map<String, Object> detailCondition) {
        this.detailCondition = detailCondition;
        log.info("detailCondition : {}",detailCondition);
    }
    //데이터 베이스에서 조회해 온 전체 레코드(행)의 수
    public void setTotalRecord(int totalRecord) {
        this.totalRecord = totalRecord;
        this.totalPages = (int) Math.ceil((double) totalRecord / pageSize); 
        // 필터를 통해 조회된 데이터의 전체레코드 수 / UI로 보여줄 페이지네이션 블럭사이즈
        log.info("totalRecord:{}",totalRecord);
        log.info("totalPages:{}",totalPages);
    }

    //현재페이지를 기준으로 테이블 데이터 조회할 행 제한
    public void setLimitRows(int currentPage) {

        //시작페이지 번호
        this.startRow = (currentPage - 1) * pageSize + 1;
        //마지막 페이지에서 데이터 수보다 큰 번호를 방지, 마지막페이지 번호
        this.endRow = Math.min(currentPage * pageSize, totalRecord);
        //totalRecord는  dao 메서드를 통해 데이터를 조회한 후 pagination setter로 설정해 줌
        log.info("startRow:{},endRow:{}",startRow,endRow);
    }

    // 찜목록 반환 값에 대한 페이지 설정에 필요한 메서드 ==> Pagination 생성자의 사용에 대해서 같이 고민해보기
    public void setCurrentPage(int currentPage) {
        this.currentPage = currentPage;
    }


    public String setClientId(String clientId) {
        return this.clientId = clientId;
    }

    public String getClientId() {
        return clientId;
    }
}


// 컨트롤러에서 Pagination 객체를 생성해 인자로
//클라이언트에서 전달해준 page,pageSize를 받아온다
// Pagination 내부의 멤버변수를 생성성자를 통해 초기화(설정) 해준다.
// 컨트롤러나 서비스 등 다른 곳에서 은닉화 된 멤버변수를 가져다 쓰려면
// getter 메소드를 사용해서 멤버변수를 반환 받는다.