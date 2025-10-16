package com.example.team01.cart;


import com.example.team01.book.service.BookService;
import com.example.team01.cart.service.CartService;
import com.example.team01.common.exception.CustomCartException;
import com.example.team01.delivery.service.AddressService;
import com.example.team01.dto.address.AddressDTO;
import com.example.team01.dto.book.BookDTO;
import com.example.team01.dto.cart.CartDTO;
import com.example.team01.security.PrincipalDetails;
import com.example.team01.utils.FileUtils;
import com.example.team01.vo.AddressVO;
import com.example.team01.vo.BookVO;
import com.example.team01.vo.CartVO;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/* DI dependency injection ==>  필드 주입과 생성자 주입의 차이점


*/



@Slf4j
@RequestMapping("/cart")
@RequiredArgsConstructor
@RestController
public class CartController {

    // cartService 생성자 주입
    private final CartService cartService;
    //배송지
    private final AddressService addressService;
    // FileUtils 생성자 주입
    private final FileUtils fileUtils;
 

    @GetMapping()
    public ResponseEntity<?> getCart(@AuthenticationPrincipal PrincipalDetails userDetails, HttpServletRequest request){
        //securityContext에 저장된 사용자 정보 받아올 매개변수 = @AuthenticationPrincipal PrincipalDetails userDetails

        log.info("get Cart 입니다");
        //로그인한 user 정보
        String clientId = userDetails.getUsername();

        //기본 배송지 조회하기
        AddressDTO selectAddr = addressService.selectCartAddress(clientId);

        //없을 경우
        List<CartDTO> cartList = cartService.selectUserBookList(clientId);
        log.info("bookList:---------------------------{}",cartList);  //cartId 확인하기

        //도서상품들의 이미지 주소 변경해주기
        List<CartDTO> bookList = cartList.stream()
                .map(cartDTO -> {
                    //cartDTO 내부에 book객체 가져오기
                    BookDTO book = cartDTO.getBook();
                    //book 이미지 변경
                    fileUtils.changeImgPathDto(book, request);
                    //cartDTO에 다시 book객체 설정
                    cartDTO.setBook(book);
                    // 수정된 객체 반환
                    return cartDTO;
                })// 클라이언트로 도서이미지 src값 설정 메서드
                .collect(Collectors.toList());
        log.info("bookList:---------------------------cart Get response : {}",bookList);

        Map<String,Object> result = new HashMap<>();
        result.put("bookList",bookList);
        result.put("address",selectAddr);

        return  ResponseEntity.ok(result);
    }

    @PostMapping()
    public ResponseEntity<?> postCart(@RequestBody CartVO cartvo,@AuthenticationPrincipal PrincipalDetails userDetails){

        log.info(" postCart  : {}",cartvo);
        log.info(" userDetails  : {}",userDetails);
        //clientId
        String clientId = userDetails.getUsername();
        log.info(" clientId  : {}",clientId);

        // 서비스 파라미터로 넘길 유저 아이디 설정
        cartvo.setClientId(clientId);

        //cartVO
        log.info(" bookId  : {}",cartvo.getBookId());// 장바구니에 담을 도서 아이디
        log.info(" quantity  : {}",cartvo.getQuantity());// 장바구니에 담은 수량
        log.info(" clientId  : {}",clientId);

        //응답담아줄 Map객체
        Map<String, Object> result = new HashMap<>();
        //insert 전에  장바구니 조회 , 중복데이터 있는지 확인
        int existBook = cartService.selectDuplicateCheck(clientId,cartvo.getBookId());
        log.info("existBook ------------- 컨트롤러에서 도서 존재여부 확인: {}",existBook);

        // 중복 데이터가 있다면  클라이언트로 수량 추가로 메시지 전달 후 수량 증가처리 ?
        if(existBook>0){
            //중복데이터가 있다면
            result.put("exist","true");
            result.put("message","이미 장바구니에 해당 도서가 존재합니다.<br/> 장바구니로 이동하시겠습니까?");

        }else{
            //중복데이터가 없다면 새로 insert ==> try catch 구문 사용하는 이유 알아보기
            //cartService에  파라미터 넘겨주기
            cartService.insertBook(cartvo);
            //반환 데이터 담기
            result.put("exist","false");
            result.put("message","장바구니에 도서가 추가되었습니다.");
            result.put("addedBookInfo", cartvo);
            log.info("장바구니 담기 성공 result ---------------------:{}",result);

        }
        return  ResponseEntity.ok(result);
    }

    //axios로 delete 요청 시 어노테이션
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteCart(@RequestBody List<String> ids,@AuthenticationPrincipal PrincipalDetails userDetails){
        log.info("deleteCart API 통신 받는 중");
        log.info("deleteCart  : {}",ids);
        int deleteResult= cartService.deleteToCartList(ids);
        String clientId = userDetails.getUsername();

        //클라이언트로 반환할 결과
        Map<String,Object> result = new HashMap<>();

        if(deleteResult>0){
            log.info("삭제 결과 11 반환");
            //데이터 재조회
            List<CartDTO> bookList = cartService.selectUserBookList(clientId);
            result.put("bookList",bookList); // 삭제된 후 장바구니 데이터 재조회
        }

        return  ResponseEntity.ok(result);
    }

    // 새로운 리소스를 생성할때
    // 장바구니 주소 선택
    @PostMapping("/addr")
    public ResponseEntity<?> updateCartAddress(@RequestBody Map<String,String> selectedAddrId,
                                               @AuthenticationPrincipal PrincipalDetails userDetails){

        log.info("selectedAddrid API");
        // update ==> selectedAddrId
        String clientId = userDetails.getUsername();
        // 선택된 주소가 없으면 (null)이면 등록된 기본 주소의 첫 번째 주소가 보임
        log.info("selectedAddrid ---------- : {}",selectedAddrId);
        String addrId = selectedAddrId.get("selectedAddrId");
        //client의 selectedId를 업데이트해주기
        int updateSelectAddress = addressService.updateCartAddress(clientId,addrId);
        log.info("selectedAddrId ------ result ---------- : {}",updateSelectAddress);


        //클라이언트로 반환할 결과
        Map<String,Object> result = new HashMap<>();

        if(updateSelectAddress < 0 ){
            return ResponseEntity.ok("주소 업데이트 실패");
        }

        // 클라이언트가 선택한 주소를 기본 주소로 받아오기
        AddressVO data= addressService.selectChangeAddress(clientId,addrId);
        result.put("updateAddr",data);
        log.info("updateAddr ----------:{}",result);

        return ResponseEntity.ok(result);
    }

    //기존 리소스를 일부 수정할 때 사용
    @PatchMapping("/quantity")
    public ResponseEntity<?> updateCartQuantity(
            @RequestBody CartVO cartvo,
            @AuthenticationPrincipal PrincipalDetails userDetails){

        log.info("updateCartQuantity API---------------------장바구니 수량변경");
        log.info("updateCartQuantity API---------------------clidentId:{}",userDetails.getUsername());
        log.info("updateCartQuantity API---------------------cartQuantityUpdate:{}",cartvo);

        // 장바구니 수량 업데이트 서비스 불러오기

        //clientId
        String clientId = userDetails.getUsername();
        //cartvo에 클라이언트 값 설정
        cartvo.setClientId(clientId);
        // 서비스로 넘겨주기
       int result =  cartService.updateToCartQuantity(cartvo);
        log.info("updateCartQuantity API---------------------result:{}",result);


        return  ResponseEntity.ok(cartvo.getQuantity());
    }


}
