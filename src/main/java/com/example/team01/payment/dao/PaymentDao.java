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
    public List<CartVO> selectCartList(@Param("clientId") String clientId);
    //결제 상태  insert
    //payId, payAccount, payStatus,payDate,payMethod,payUpdateDate,addrId
    public int insertPayment(PaymentVO paymentVO);
    public int insertPaymentList(@Param("payId") String payId,@Param("bookId") String bookId, @Param("quantity") int quantity);

    //mypage 결제내역 목록들조회
    public List<PaymentListVO> selectPaymentList(String clientId);
    // 결제상품 수량 조회 (부분취소시 사용)
    public List<PaymentQuantityVO> selectPaymentQuantity(@Param("payIds")  List<String> payIds);


    //mypage payment 결제취소 상태 갱신(Update)
    public int partialCancel(@Param("payId") String payId,@Param("clientId") String clientId,@Param("bookIds")List<String> bookIds);
    public int allCancel(@Param("payId") String payId,@Param("clientId") String clientId);

    //결제취소 계산 이후 관련 데이터 조회-
    public PaymentListVO  selectCancelBooksInfo (@Param("payId") String payId,@Param("bookId") String bookId);

    public int UpdateCancelPaymentAccount(@Param("payId") String payId
                                    ,@Param("payAccount") int payAccount
                                    ,@Param("clientId") String clientId);

    //개별 결제취소 상태값 갱신
    public int UpdatePaymentListCancelStatus(@Param("payId") String payId
            ,@Param("bookId") String bookId
            ,@Param("partPayStatus") String partPayStatus);



}
