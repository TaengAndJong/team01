package com.example.team01.userViewBook;


import com.example.team01.security.PrincipalDetails;
import com.example.team01.userViewBook.service.UserViewBookService;
import com.example.team01.vo.UserViewBookVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/*
* 사용자 조회시 데이터 일관성을 유지하기 위해 서버에서도 조회 및 중복조회 처리
*
* 쿼리스트링이나, formData는 RequestParam , Json body는 RequstBody
*
* */

@Slf4j
@RequestMapping("/viewBook")
@RequiredArgsConstructor
@RestController
public class UserViewBookController {

    private final UserViewBookService userViewBookService;

    @PostMapping
    public ResponseEntity<?> postUserViewBooks(@RequestBody UserViewBookVO viewBookId,
            @AuthenticationPrincipal PrincipalDetails userDetails) {
        //필요 파라미터 clietnId와 bookId
        String clientId =userDetails.getUsername(); //시큐리티에서 사용자 정보 가져오기
        String bookId= viewBookId.getBookId();
        //
        log.info("사용자 데이터 조회  bookId :{} , clientId :{} ", bookId, clientId);
        //서비스로 파리미터 넘겨주기
        userViewBookService.insertUserViewBook(bookId,clientId);

        
        
        return null;
    }



}
