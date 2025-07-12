package com.example.team01.payment.service;


import com.example.team01.common.Enum.PayStatus;
import com.example.team01.delivery.dao.AddressDao;
import com.example.team01.delivery.service.AddressService;
import com.example.team01.dto.address.AddressDTO;
import com.example.team01.dto.book.BookDTO;
import com.example.team01.dto.cart.CartDTO;
import com.example.team01.dto.payment.PaymentDTO;
import com.example.team01.payment.dao.PaymentDao;
import com.example.team01.vo.AddressVO;
import com.example.team01.vo.BookVO;
import com.example.team01.vo.CartVO;
import com.example.team01.vo.PaymentVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
public class PaymentServiceImple implements PaymentService {

    private final PaymentDao dao;
    private final AddressDao addrDao;

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


    public int insertPayment(PaymentVO paymentVO){
        log.info("service insertPayment----------:{}",paymentVO);
        //검증필요 ==> paymentVO.setPayStatus() ==> 결제완료,결제대기,결제실패
        //payment이 어떤조건을 기준으로 값을 세팅할 것인가!
        int cnt = 0;
        if(paymentVO != null){
            // payState 값 설정해주기
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



}
