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

    //mypage paymentList 결제취소 삭제(delete) 파라미터는 payId, bookId들
    @Override
    public int deletePaymentList( List<String> payIds, List<String> bookIds) {
        log.info("deletePaymentList--serviceIMple payId:{},bookIds:{}",payIds,bookIds);
        int cnt = dao.deletePaymentList(payIds,bookIds);

        log.info("deletePaymentList----------cnt:{}",cnt);
        return cnt;
    }

    //mypage payment 결제취소 상태 갱신(Update) , 파라미터 payId, clientId
    @Override
    public int partialCancel(String payId,String clientId,Boolean status,List<String> bookIds) {
        log.info("partialCancel-- payId:{},clientId:{},stauts:{},bookIds:{}",payId,clientId,status,bookIds);
        //결제 취소한 도서에 대한 정보 및 취소한 값을 제외한 결제내역 계산데이터
        PaymentListVO cancelInfos = dao.selectCancelBooksInfo(payId,bookIds);
        log.info("cancelInfos:{}",cancelInfos);
        log.info("getPayAccount:{}",cancelInfos.getPayAccount());
        log.info("getCancelPayAccount:{}",cancelInfos.getCancelPayAccount());
        log.info("getResultPayAccount:{}",cancelInfos.getResultPayAccount());
        //
        int remainPayAccount =cancelInfos.getResultPayAccount();
        log.info("remainPayAccount:{}",remainPayAccount);

        // 1. payment 에 payAccount 값 갱신
        //2, payment 에 payStatus 값 갱신 ==> 부분 취소
        //3. payment 에 UpayUpdateDate 값 갱신 필요 ==> 첫번째 결제 다음 payment 테이블 값이 변경 되었을 경우



        int cnt =0;
        // paymentList

        return cnt;
    }


    @Override
    public int allCancel(String payId,String clientId,Boolean status) {
        log.info("allCancel-- payId:{},clientId:{},stauts:{}",payId,clientId,status);

        int cnt =0;


        return cnt;
    }



    // 결제수량 조회
    @Override
    public List<PaymentQuantityVO> selectPaymentQuantity(List<String> payIds){
        List<PaymentQuantityVO> defaultQuantity = dao.selectPaymentQuantity(payIds);
        log.info("result---selectPaymentQuantity :{}",defaultQuantity);
        return defaultQuantity;
    }
    

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
                        .bookPrice(vo.getBookPrice())
                        .publishDate(vo.getPublishDate())
                        .bookImgPath(vo.getBookImgPath())
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
                .clientId(firstObject.getClientId())
                .books(books)
                .address(address)
                .build();

        log.info("paymentListDTO---------------------paymentServiceImple:{}",paymentListDTO);

        return paymentListDTO;
    }






}
