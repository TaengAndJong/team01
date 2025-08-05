package com.example.team01.payment.service;


import com.example.team01.common.Enum.PayStatus;
import com.example.team01.delivery.dao.AddressDao;
import com.example.team01.delivery.service.AddressService;
import com.example.team01.dto.address.AddressDTO;
import com.example.team01.dto.book.BookDTO;
import com.example.team01.dto.cart.CartDTO;
import com.example.team01.dto.payment.PaymentCancelDTO;
import com.example.team01.dto.payment.PaymentDTO;
import com.example.team01.dto.payment.PaymentListDTO;
import com.example.team01.payment.dao.PaymentDao;
import com.example.team01.utils.FileUtils;
import com.example.team01.vo.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
public class PaymentServiceImple implements PaymentService {

    private final PaymentDao dao;
    private final AddressDao addrDao;
    private final FileUtils fileUtils;

    @Override
    public List<CartDTO> selectCartList(String clientId) {

        List<CartVO> voList= dao.selectCartList(clientId);

        log.info("voList------------: {}", voList);
        //PaymentDTO bookDTO로 도서 객체 정리 및 cartDTO의 bookList에 재설정
        // cartDTO로 변환해서 반환
        List<CartDTO>  cartDTOList =  voList.stream()
                .map(this::convertToCartDTO)
                .collect(Collectors.toList());

        log.info("cartDTOList-------:{}",cartDTOList);
        return cartDTOList;
    }
    @Override
    public int insertPayment(PaymentVO paymentVO,String clientId){
        log.info("service insertPayment----------:{}",paymentVO);
        //검증필요 ==> paymentVO.setPayStatus() ==> 결제완료,결제대기,결제실패
        //payment이 어떤조건을 기준으로 값을 세팅할 것인가!
        int cnt = 0;
        if(paymentVO != null){
            // payState 값 설정해주기
            paymentVO.setClientId(clientId);
            paymentVO.setPayStatus(PayStatus.COMPLETED.getStatus());
            log.info("insert paymentVO-------:{}",paymentVO);
            // dao로 넘겨주기
            return cnt= dao.insertPayment(paymentVO);
        }
        log.info("insert dao-------:{}",cnt);
        return cnt;
    }
    @Override
    public int insertPaymentList(PaymentVO PaymentVO) {
        log.info("service insertPaymentList----------:{}",PaymentVO);

        int cnt = 0;
        String payId= PaymentVO.getPayId();
        List<CartVO> bookList = PaymentVO.getBookList();
//        log.info("service insertPaymentList----------payId:{}",payId);
//        log.info("service insertPaymentList----------bookList:{}",bookList);

        //bookId 개수만큼 insert 해야함
        for (CartVO item : bookList) {
            //insert되는 값 누적
            log.info("service insertPaymentList----------payId:{},bookId:{},quantity:{}",payId, item.getBookId(), item.getQuantity());
            cnt += dao.insertPaymentList(payId, item.getBookId(), item.getQuantity());
        }
        log.info("service insertPaymentList----------cnt:{}",cnt);
        //payId, quantity  bookId
        return cnt;
    }
    // 결제수량 조회
    @Override
    public List<PaymentQuantityVO> selectPaymentQuantity(List<String> payIds){
        List<PaymentQuantityVO> defaultQuantity = dao.selectPaymentQuantity(payIds);
        log.info("result---selectPaymentQuantity :{}",defaultQuantity);
        return defaultQuantity;
    }
    @Override
    public List<PaymentListDTO> selectPaymentList(String clientId){

        List<PaymentListVO> paymentListVO =  dao.selectPaymentList(clientId);

        // Step 1. payId 기준으로 Grouping
        Map<String, List<PaymentListVO>> groupedMap = paymentListVO.stream()
                .collect(Collectors.groupingBy(PaymentListVO::getPayId));

        log.info("groupeMap--------:{}",groupedMap);
        //결과 담아서 반환할 변수
        List<PaymentListDTO> result = groupedMap.entrySet().stream()
                .map(entry ->{
                    PaymentListDTO dto = convertToPaymentListDTO(entry.getValue());
                    return dto;
                }).collect(Collectors.toList());

        log.info("PaymentListDTO result:{}",result);
        return result;
    }


    //mypage payment 결제취소 상태 갱신(Update) , 파라미터 payId, clientId
    @Override
    @Transactional//하나의 작업이 취소되면 전부 취소되게 해주는 어노테이션(2개이상작업 있을경우 필요)
    public int partialCancel(String payId,String clientId,String bookId) {
        log.info("partialCancel-- payId:{},clientId:{},bookId:{}",payId,clientId,bookId);

        int cnt =0;
        String partPayStatus = PayStatus.CANCEL.getStatus();
        //결제 취소된 가격
       PaymentListVO paybookInfo =  dao.selectCancelBooksInfo(payId,bookId);
       log.info("paybookInfo--:{}",paybookInfo);

        //paymentList의 partPayStatus 상태값 갱신
        int resutPayAccount = paybookInfo.getResultPayAccount();
        log.info("resutPayAccount--:{}",resutPayAccount);
        //payment의 payAccount 값 갱신

        //paymentList partPayStatus 강태값 갱신
        cnt += dao.UpdatePaymentListCancelStatus(payId,bookId,partPayStatus);
        log.info("cnt 1: {}",cnt);
        //payment 테이블 총 결제가격 갱신
        cnt += dao.UpdateCancelPaymentAccount(payId,resutPayAccount,clientId);
        log.info("cnt 2: {}",cnt);
        
        return cnt;
    }

    @Override
    @Transactional//하나의 작업이 취소되면 전부 취소되게 해주는 어노테이션(2개이상작업 있을경우 필요)
    public int allCancel(String payId,List<String> bookIds,String clientId) {
        int cnt =0;

        log.info("allCancel-- payId:{},bookIds:{},clientId:{}",payId,bookIds,clientId);
        //들어온 paymentList 테이블에서 payId와 bookIds를 파라미터로 해당 데이터 조회
       List<PaymentListVO> result = dao.selectAllCancelPaymentList(payId,bookIds,clientId);
        log.info("all Cancel result : {}",result);
        for (PaymentListVO vo : result) {
            //vo.getPartPayStatus가 cancel이 아닌경우 partPayStatus 상태값 cancel로 갱신
           log.info("partPayStatus---------vo:{}", vo.getPartPayStatus());
           if(PayStatus.COMPLETED.getStatus().equals(vo.getPartPayStatus())){
                log.info("Enum 비교 시 null 예외 발생방지,항상 유효한 문자열을 반환하기때문에 : null-safe ");
               //해당 bookId에 대해서 partPayStatus 를 cancel로 변경해주기
               dao.UpdatePaymentListCancelStatus(vo.getPayId(),vo.getBookId(),PayStatus.CANCEL.getStatus());
           }
        }

        // paymentList의 의 해당 payId의 모든 bookIds의 partStaus가 cancel 이면 payment테이블의 payStatus를 cancel로 변경
        //paymentList 새로 업데이트된 데이터 조회해오기
        List<PaymentListVO> updatePaymentList = dao.selectCancelPaymentList(payId,bookIds);
        // 조회한 updatePaymentList 순회하여 partPayStatus 상태값 Cancel 확인 후, 전부 취소상태이면 Payment 테이블 결제상태 갱신
        boolean allCancelled =
                updatePaymentList.stream()
                        .allMatch(vo
                                -> PayStatus.CANCEL.getStatus().equals(vo.getPartPayStatus()));

        //전부 조건에 맞아 매칭되면 true 반환
        if(allCancelled){
            log.info("all canceled:{}",allCancelled);
            //payment payStatus 값 전체 취소로 갱신
          cnt= dao.updateCancelPayment(payId,PayStatus.CANCELALL.getStatus(), clientId);
        }
        log.info(" 전체취소 cnt:{}",cnt);
        return cnt;
    }


    //결제페이지에 전달할 장바구니 도서목록
    private CartDTO convertToCartDTO(CartVO cartvo) {
        //cartVO를 cartDTO로 변경
        log.info("CartDTO--------vo : {}",cartvo);
        BookVO bookList = cartvo.getBookList().get(0);

        //cartVO에 담긴 bookList 데이터를 DTO
        BookDTO bookDTO = null;
        if(bookList != null) {
             bookDTO = BookDTO.builder()
                    .bookId(cartvo.getBookId())
                    .bookName(bookList.getBookName())
                    .bookCateNm(bookList.getBookCateNm())
                    .bookCateDepth(bookList.getBookCateDepth())
                    .author(bookList.getAuthor())
                    .publishDate(bookList.getPublishDate())
                    .bookPrice(bookList.getBookPrice())
                    .stock(bookList.getStock())
                    .bookImgPath(bookList.getBookImgPath()).build();

        }

        log.info("bookDTO-----------paymentImple :{}",bookDTO);

        CartDTO cartDto = CartDTO.builder()
                .cartId(cartvo.getCartId())
                .addCartDate(cartvo.getAddCartDate())
                .quantity(cartvo.getQuantity())
                .clientId(cartvo.getClientId())
                .roleId(cartvo.getRoleId())
                .book(bookDTO)
                .build();

        return cartDto;
    }

    private PaymentListDTO convertToPaymentListDTO(List<PaymentListVO> voList) {

        if (voList == null || voList.isEmpty()) {
            return new PaymentListDTO();
        }
        //voList에 담긴 데이터들 중 하나의 객체 가져오기
        PaymentListVO firstObject = voList.get(0);

        log.info("firstObjects---------:{}",firstObject);

        //books DTO 설정하기
        List<BookDTO> books = voList.stream().map(vo -> BookDTO.builder()
                .bookId(vo.getBookId())
                        .bookCateNm(vo.getBookCateNm())
                        .bookCateDepth(vo.getBookCateDepth())
                        .bookName(vo.getBookName())
                        .author(vo.getAuthor())
                        .quantity(vo.getQuantity())
                        .bookPrice(vo.getBookPrice())
                        .publishDate(vo.getPublishDate())
                        .bookImgPath(vo.getBookImgPath())
                        .partPayStatus(vo.getPartPayStatus())
                .build())
                .collect(Collectors.toList());
        
        //Address DTO 설정하기
       AddressDTO address = voList.stream().map(vo -> AddressDTO.builder()
               .addrId(vo.getAddrId())
               .addrType(vo.getAddrType())
               .addr(vo.getAddr())
               .detailAddr(vo.getDetailAddr())
               .zoneCode(vo.getZoneCode()).build()).collect(Collectors.toList()).get(0);

        //paymetListDTO 설정하기
        PaymentListDTO paymentListDTO = PaymentListDTO.builder()
                .payId(firstObject.getPayId())
                .payMethod(firstObject.getPayMethod())
                .payDate(firstObject.getPayDate())
                .payStatus(firstObject.getPayStatus())
                .payUpdateDate(firstObject.getPayUpdateDate())
                .quantity(firstObject.getQuantity())
                .clientId(firstObject.getClientId())
                .books(books)
                .address(address)
                .build();

        log.info("paymentListDTO---------------------paymentServiceImple:{}",paymentListDTO);

        return paymentListDTO;
    }






}
