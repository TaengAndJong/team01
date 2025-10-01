package com.example.team01.userViewBook.service;

import com.example.team01.userViewBook.dao.UserViewBookDao;
import com.example.team01.userViewBook.dto.UserBookResponseDTO;
import com.example.team01.vo.UserViewBookVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Transactional // 스프링에서 트랜잭션 관리
@Service
public class UserViewBookServiceImple implements UserViewBookService {

    private final UserViewBookDao dao;


    @Override
    public int insertUserViewBook(String bookId,String clientId) {
        log.info("insertUserViewBook ---------:{}",bookId);
        int result = dao.insertUserViewBook(bookId,clientId);

        return result;
    }


    @Override
    public List<UserBookResponseDTO> selectUserViewBook(String clientId) {
        log.info("selectUserViewBook 사용자가 조회한 도서 데이터------------:{}",clientId);
        List<UserViewBookVO> userViewBookVOList = dao.selectUserViewBook(clientId);
        log.info("selectUserViewBook dao.selectUserViewBook:{}",userViewBookVOList);

        //UserBookResponseDTO 타입으로 변환된 객체들을 담을 배열 객체
        List<UserBookResponseDTO> userBookResponseDto= new ArrayList<>();

        // vo To DTO
        for(UserViewBookVO userViewBookVO:userViewBookVOList){
            //vo객체 하나씩 순회
            log.info("userViewBookVO -------- 사용자 도서상품 조회 DTO로  변경 전:{}",userViewBookVO);
            // vo객체를 Dto로 변경
            UserBookResponseDTO dto = voToDto(userViewBookVO);
            log.info("userViewBookVO -------- 사용자 도서상품 조회 DTO로 변경 후:{}",dto);
            // dto로 변환된 데이터 결과 넣어주기
            userBookResponseDto.add(dto);
        }

        /*
        자바8버전부터 stream 사용가능
        * stream() API를 사용한 코드
        * List<UserBookResponseDTO> dto =
        * userViewBookVOList.stream() // stream()API를 이용하여 Stream<UserViewBookVO> 로 변환
        * .map(this::voToDto) // Stream<UserViewBookVO> 로 변환된 객체들을 Map을 통해 순회하여, dto로 변환
        * .collect(Colletors.toList()); // 흩어진 객체들은 list 묶어서 반환
        * */

        return userBookResponseDto;
    }



    public UserBookResponseDTO voToDto(UserViewBookVO vo){
        log.info("userViewBookVO---- voToDTO :{}",vo);
        // DTO 객체로 변환하기




        return null;
    }

}
