package com.example.team01.admin;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.team01.utils.Pagination;
import com.example.team01.admin.service.AdminService;
import com.example.team01.admin.dto.StockBookDTO;
import com.example.team01.admin.dto.ChartDataDTO;
import com.example.team01.admin.dto.NewBookDTO;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import org.springframework.web.bind.annotation.RequestParam;
import java.util.List;

@Slf4j
@RestController    //전역 ResponseBody
@RequiredArgsConstructor
@RequestMapping("/admin")
public class AdminController {

    private final AdminService adminService;

    @GetMapping
    public Map<String, Object> adminHandler(HttpSession session) {
        Object authentication = session.getAttribute("SPRING_SECURITY_CONTEXT");
        log.info("authentication-----------------: {}", authentication);
        if (authentication == null) {
            log.warn("사용자가 인증되지 않았습니다.");
        }

        log.info("Authentication in session: {}", authentication);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "안녕하세요. 관리자 페이지입니다.");
        response.put("timestamp", new java.util.Date());
        return response;
    }

    // 문의별 게시물 데이터 길이 반환

    @GetMapping("/newCount")
    public ResponseEntity<?> getNewQnaOneLength()
    {
        int result1 = adminService.getQnaOneLength();
        int result2 = adminService.getProductLength();
        int result3 = adminService.getDeliveryLength();
        log.info("Controller result1: {}, result2: {}, result3: {}", result1, result2, result3);
        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("qnaCount", result1);
        resultMap.put("productCount", result2);
        resultMap.put("deliveryCount", result3);
        log.info("resultNewCount---get:{}", resultMap);
        return  ResponseEntity.ok(resultMap);
    }
    // // 금일 기준(00시) 신규 가입자 반환
    
    // 신규 등록 도서 데이터 가져오기 (일주일 기준 테이블로 출력)
    @GetMapping("/newDomesticBook")
    public ResponseEntity<?> getNewDomesticBook(
        @RequestParam(defaultValue = "1") int currentPage,
        @RequestParam(defaultValue = "5") int pageSize)
        {
        Pagination pagination = new Pagination(currentPage, pageSize);
        List<NewBookDTO> bookData = adminService.getNewDomesticBooks(pagination);

        for (NewBookDTO newBookDTO : bookData) {
        log.info("여기--검색 책목록:{}", newBookDTO);
        // fileUtils.changeImgPath(qnaProductVO,request); // 새로운 이미지주소를 가진  bookVO객체가 반환됨
        log.info("다음--검색 책목록:{}", newBookDTO);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("items", bookData); // getAllQnaProductList로 가져온 게시물 items에 추가
        result.put("currentPage", pagination.getCurrentPage());
        result.put("pageSize", pagination.getPageSize());
        result.put("totalPages", pagination.getTotalPages());
        result.put("totalRecord", pagination.getTotalRecord());
        log.info("resultDomestic---get:{}", result);

        return ResponseEntity.ok(result);
    }
    @GetMapping("/newForeignBook")
    public ResponseEntity<?> getNewForeignBook(
        @RequestParam(defaultValue = "1") int currentPage,
        @RequestParam(defaultValue = "5") int pageSize)
        {
        Pagination pagination = new Pagination(currentPage, pageSize);
        List<NewBookDTO> bookData = adminService.getNewForeignBooks(pagination);

        for (NewBookDTO newBookDTO : bookData) {
        log.info("여기--검색 책목록:{}", newBookDTO);
        log.info("다음--검색 책목록:{}", newBookDTO);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("items", bookData); // getAllQnaProductList로 가져온 게시물 items에 추가
        result.put("currentPage", pagination.getCurrentPage());
        result.put("pageSize", pagination.getPageSize());
        result.put("totalPages", pagination.getTotalPages());
        result.put("totalRecord", pagination.getTotalRecord());
        log.info("resultForeign---get:{}", result);

        return ResponseEntity.ok(result);
    }
    @GetMapping("/newEbook")
    public ResponseEntity<?> getNewEbook(
        @RequestParam(defaultValue = "1") int currentPage,
        @RequestParam(defaultValue = "5") int pageSize)
        {
        Pagination pagination = new Pagination(currentPage, pageSize);
        List<NewBookDTO> bookData = adminService.getNewEBooks(pagination);

        for (NewBookDTO newBookDTO : bookData) {
        log.info("여기--검색 책목록:{}", newBookDTO);
        log.info("다음--검색 책목록:{}", newBookDTO);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("items", bookData); // getAllQnaProductList로 가져온 게시물 items에 추가
        result.put("currentPage", pagination.getCurrentPage());
        result.put("pageSize", pagination.getPageSize());
        result.put("totalPages", pagination.getTotalPages());
        result.put("totalRecord", pagination.getTotalRecord());
        log.info("resultEbook---get:{}", result);

        return ResponseEntity.ok(result);
    }
    
    // 재고 부족 도서 데이터 가져오기 (재고(stock) 10개 이하 테이블로 출력)
    @GetMapping("/domesticStock")
    public ResponseEntity<?> getStockDomesticBooks(
        @RequestParam(defaultValue = "1") int currentPage,
        @RequestParam(defaultValue = "5") int pageSize)
        {

        Pagination pagination = new Pagination(currentPage, pageSize);
        
        List<StockBookDTO> bookData = adminService.getStockDomesticBooks(pagination);

        for (StockBookDTO stockBookDTO : bookData) {
        log.info("여기--검색 책목록:{}", stockBookDTO);
        // fileUtils.changeImgPath(qnaProductVO,request); // 새로운 이미지주소를 가진  bookVO객체가 반환됨
        log.info("다음--검색 책목록:{}", stockBookDTO);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("items", bookData); // getAllQnaProductList로 가져온 게시물 items에 추가
        result.put("currentPage", pagination.getCurrentPage());
        result.put("pageSize", pagination.getPageSize());
        result.put("totalPages", pagination.getTotalPages());
        result.put("totalRecord", pagination.getTotalRecord());
        log.info("resultDomesticStock---get:{}", result);

        return ResponseEntity.ok(result);
    }
    @GetMapping("/foreignStock")
    public ResponseEntity<?> getStockForeignBooks(
        @RequestParam(defaultValue = "1") int currentPage,
        @RequestParam(defaultValue = "5") int pageSize)
        {
        
        Pagination pagination = new Pagination(currentPage, pageSize);
        List<StockBookDTO> bookData = adminService.getStockForeignBooks(pagination);
        
        for (StockBookDTO stockBookDTO : bookData) {
        log.info("여기--검색 책목록:{}", stockBookDTO);
        // fileUtils.changeImgPath(qnaProductVO,request); // 새로운 이미지주소를 가진  bookVO객체가 반환됨
        log.info("다음--검색 책목록:{}", stockBookDTO);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("items", bookData); // getAllQnaProductList로 가져온 게시물 items에 추가
        result.put("currentPage", pagination.getCurrentPage());
        result.put("pageSize", pagination.getPageSize());
        result.put("totalPages", pagination.getTotalPages());
        result.put("totalRecord", pagination.getTotalRecord());
        log.info("resultForeignStock---get:{}", result);

        return ResponseEntity.ok(result);
    }
    @GetMapping("/ebooksStock")
    public ResponseEntity<?> getStockEBooks(
        @RequestParam(defaultValue = "1") int currentPage,
        @RequestParam(defaultValue = "5") int pageSize)
        {

        Pagination pagination = new Pagination(currentPage, pageSize);
        
        List<StockBookDTO> bookData = adminService.getStockEBooks(pagination);

        for (StockBookDTO stockBookDTO : bookData) {
        log.info("여기--검색 책목록:{}", stockBookDTO);
        // fileUtils.changeImgPath(qnaProductVO,request); // 새로운 이미지주소를 가진  bookVO객체가 반환됨
        log.info("다음--검색 책목록:{}", stockBookDTO);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("items", bookData); // getAllQnaProductList로 가져온 게시물 items에 추가
        result.put("currentPage", pagination.getCurrentPage());
        result.put("pageSize", pagination.getPageSize());
        result.put("totalPages", pagination.getTotalPages());
        result.put("totalRecord", pagination.getTotalRecord());
        log.info("resultEbooksStock---get:{}", result);

        return ResponseEntity.ok(result);
    }

    @GetMapping("/visitCount")
    public ResponseEntity<?> getVisitPageViewCount(ChartDataDTO chartDataDTO) {
            log.info("차트 데이터 요청 들어옴");
    LocalDate endDate = LocalDate.now();
    LocalDate startDate = endDate.minusDays(3);
    LocalDate queryEndDate = endDate.plusDays(1);
    log.info("endDate :{},startDate:{}","queryEndDate:{}",endDate,startDate,queryEndDate);
        List<ChartDataDTO> chartDataList = adminService.getVisitPageViewCount(startDate.toString(), queryEndDate.toString());
    log.info("chartDataList : {}",chartDataList);
        return ResponseEntity.ok(chartDataList);
    }
}
