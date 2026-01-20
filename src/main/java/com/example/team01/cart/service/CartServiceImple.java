package com.example.team01.cart.service;

import com.example.team01.cart.dao.CartDao;
import com.example.team01.common.exception.cart.CustomCartException;
import com.example.team01.book.dto.BookDTO;
import com.example.team01.cart.dto.CartDTO;
import com.example.team01.vo.BookVO;
import com.example.team01.vo.CartVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Transactional
@Service
public class CartServiceImple implements CartService{

    private final CartDao dao;


    // 장바구니에서 도서 데이터 조회할 메서드(단일추가)
    @Override
    public CartVO selectBookInfo(Long bookId) {
        CartVO bookInfo = dao.selectBookInfo(bookId);
        return bookInfo;

    }


    // 장바구니에 추가한 도서 데이터 디비에 insert 할 메서드
    @Override
    public int insertBook(CartVO cartVO) {

        int cnt = 0;
        log.info("insertBook--------cartVO:{}",cartVO);
        // 디비 cart 테이블이 도서목록이 존재하는지 확인
        Long bookId = cartVO.getBookId();
        int quantity = cartVO.getQuantity();

        // 있으면 수량만 갱신 및 도서테이블의 수량 갱신 필요
        BookVO bookInfo = dao.checkBookCount(bookId);
       log.info("insertBook--------bookInfo:{}",bookInfo);
       int stock = bookInfo.getStock();

       // 주문 수량이 재고수량보다 많은 경우 반환 필요
        if(quantity > stock || stock == 0 ){
            log.info("insertBook--------quantity:{}",quantity);
            log.info("insertBook--------stock:{}",stock);
            throw CustomCartException.outOfStock(bookId,stock); // 서비스에서 예외를 던짐
        }else { // stock 과 같거나 그 이상일경우  장바구니에 담을 수 있는 경우
            String clientId = cartVO.getClientId();
            log.info("insertBook--------clientId:{}",clientId);

            //cart에 이미 있는지 없는지 확인하기 ==> cart 테이블에서 조회
            int existCart =  dao.existCart(clientId,bookId);
            log.info("장바구니에 도서 존재여부--------existBook:{}",existCart);

            // 장바구니에 존재하지않으면
            if(existCart == 0){
                log.info("existBook-----데이터 삽입");
                // cartVO 업데이트
                return cnt = dao.insertCart(cartVO);
            }else{
                log.info("existBook-----데이터 업데이트");
                //장바구니에 존재하면 stock만 update진행
                return cnt = dao.updateCart(bookId,quantity);
            }
        }

    }


    // 로그인한 클라이언트에 해당하는 장바구니의 도서전체목록 조회 메서드
    @Override
    public List<CartDTO> selectUserBookList(String clientId) {
        log.info("장바구니 도서목록 조회:{}",clientId);
        List<CartVO> bookList = dao.selectUserBookList(clientId);
        log.info("bookList------------cartServiceimple :{}",bookList);

        //서비스로직에서 VO 를 DTO로변환하여 반환
        List<CartDTO> cartDTOList = bookList.stream()// bookList 객체  순회
                .map(this::convertToDTO)// bookList 내부 각각의 객체에 converToDTO메서드를 호출해 적용하여 변환(메서드 호출)
                .collect(Collectors.toList()); // 다시 List 객체로 변환
        log.info("cartDTOList:{}",cartDTOList);
        return cartDTOList;
    }


    //장바구니에 담긴 해당 클라이언트의 특정상품 중복 조회
    @Override
    public int selectDuplicateCheck(String clientId, Long bookId) {

        log.info("selectDuplicateCheck clientId:{} , bookId :{}",clientId,bookId);
        // 중복이면 1 , 아니면 0 반환
        return  dao.existCart(clientId,bookId);
    }

    // 로그인한 클라이언트의 장바구니에 담긴 도서 목록 삭제 메서드
    @Override
    public int deleteToCartList(List<Long> deleteIds) {
        log.info("장바구니 도서삭제 목록-------------:{}",deleteIds);
        //로그인한 사용자와 삭제 요청의 연관성 검증

        //파라미터의 값이 null 인지 , 비어있는지 검증 필요
        if(deleteIds == null || deleteIds.isEmpty()){
            log.info("파라미터의 값이 null 인지 , 비어있는지 검증 필요");
        }
        int cnt = dao.deleteToCartList(deleteIds);
        log.info("장바구니 도서삭제 성공 cnt-------------:{}",cnt);
        return cnt;
    }

    @Override
    @Transactional
    public int updateToCartQuantity(CartVO bookInfo) {
        log.info("장바구니 도서수량 변경:{}",bookInfo);
        int cnt = 0;
        //파라미터의 값이 null 인지 , 비어있는지 검증 필요
        if(bookInfo == null){
            log.info("객체가 비어있음:{}",bookInfo);
            return cnt;
        }

        //넘겨줄 파라미터 분리하기
        String clientId = bookInfo.getClientId();
        Long cartId = bookInfo.getCartId();
        Long bookId = bookInfo.getBookId();
        int quantity = bookInfo.getQuantity();
         cnt = dao.updateCartQuantity(cartId,bookId,quantity);
        log.info("장바구니 도서수량 변경 cnt:{}",cnt);
        return cnt;
    }

    //cartVO change to DTO
    private CartDTO convertToDTO(CartVO vo) {
        log.info("convertToDTO--------vo:{}",vo);

      //cartVO에 담긴 bookList 데이터를 DTO로
       BookDTO bookDTO = BookDTO.builder()
               .bookId(vo.getBookId())
               .bookName(vo.getBookVO().getBookName())
               .bookCateNm(vo.getBookVO().getBookCateNm())
               .bookCateDepth(vo.getBookVO().getBookCateDepth())
               .author(vo.getBookVO().getAuthor())
               .publishDate(vo.getBookVO().getPublishDate())
               .bookPrice(vo.getBookVO().getBookPrice())
               .stock(vo.getBookVO().getStock())
               .quantity(vo.getQuantity())
               .bookImgPath(vo.getBookVO().getBookImgPath()).build();


       CartDTO cartDto = CartDTO.builder()
               .cartId(vo.getCartId())
               .addCartDate(vo.getAddCartDate())
//               .quantity(vo.getQuantity())
               .clientId(vo.getClientId())
               .roleId(vo.getRoleId())
               .book(bookDTO)
               .build();

        log.info("convertToDTO--------cartDto:{}",cartDto);

        return cartDto;
    }



}
