package com.example.team01.payment.dao;

import com.example.team01.dto.payment.PaymentListDTO;
import com.example.team01.vo.CartVO;
import com.example.team01.vo.PaymentListVO;
import com.example.team01.vo.PaymentQuantityVO;
import com.example.team01.vo.PaymentVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface PaymentDao {

    //문자열 clinetId를 받아서 반환되는 데이터들은 목록은 CartVO타입
    List<CartVO> selectCartList(@Param("clientId") String clientId);
    //결제 상태  insert
    //payId, payAccount, payStatus,payDate,payMethod,payUpdateDate,addrId
    int insertPayment(PaymentVO paymentVO);
    int insertPaymentList(@Param("payId") Long payId, @Param("bookId") Long bookId, @Param("quantity") int quantity);

    //mypage 전체 결제내역 목록들조회
    List<PaymentListVO> selectPaymentList(String clientId);
    // 결제상품 수량 조회 (부분취소시 사용)
     List<PaymentQuantityVO> selectPaymentQuantity(@Param("payIds")  List<Long> payIds);
    //maypage 한 PayId에 해당하는 전첼취소 결제내역 데이터 조회
     List<PaymentListVO> selectAllCancelPaymentList(@Param("payId") Long payId, @Param("bookIds") List<Long> bookIds, String clientId);
    
    //mypage payment 결제취소 상태 갱신(Update)
     int partialCancel(@Param("payId") String payId,@Param("clientId") String clientId,@Param("bookIds")List<Long> bookIds);
     int allCancel(@Param("payId") String payId,@Param("clientId") String clientId);

    //결제취소 계산 이후 관련 데이터 조회-
     PaymentListVO  selectCancelBooksInfo (@Param("payId") Long payId,@Param("bookId") Long bookId);

     int UpdateCancelPaymentAccount(@Param("payId") Long payId
                                    ,@Param("payAccount") int payAccount
                                    ,@Param("clientId") String clientId);

    //개별 결제취소 상태값 갱신
     int UpdatePaymentListCancelStatus(@Param("payId") Long payId
            ,@Param("bookId") Long bookId
            ,@Param("partPayStatus") String partPayStatus);


    //mypage 특정 결제내역, 도서들 목록조회
     List<PaymentListVO> selectCancelPaymentList(
            @Param("payId") Long payId
            ,@Param("bookIds") List<Long> bookIds);

    //payment paystatus 값 갱신
     int updateCancelPayment(@Param("payId") Long payId
            ,@Param("payStatus") String payStatus
            ,@Param("clientId") String clientId);

    //3개월 내 결제건수 조회
     int selectPaymentCnt(@Param("clientId") String clientId);

}
