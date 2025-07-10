package com.example.team01.payment.service;


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

    //결제완료후 클라이언트로 전달
//    private PaymentDTO convertToPaymentDTO(PaymentVO vo) {
//        log.info("PaymentDTO--------vo:{}",vo);
//        return dto;
//    }


}
