package com.example.team01.payment.service;

import com.example.team01.dto.address.AddressDTO;
import com.example.team01.dto.cart.CartDTO;
import com.example.team01.dto.payment.PaymentCancelDTO;
import com.example.team01.dto.payment.PaymentDTO;
import com.example.team01.dto.payment.PaymentListDTO;
import com.example.team01.vo.CartVO;
import com.example.team01.vo.PaymentListVO;
import com.example.team01.vo.PaymentQuantityVO;
import com.example.team01.vo.PaymentVO;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface PaymentService {

    public List<CartDTO> selectCartList(String clientId);
    public int insertPayment(PaymentVO paymentVO,String clientId);//결제정보
    public int insertPaymentList(PaymentVO paymentVO);//결제내역 정보

    //mypage 결제내역 목록들조회
    public List<PaymentListDTO> selectPaymentList(String clientId);

    //mypage paymentList 결제취소 삭제(delete) 파라미터는 payId, bookId들
    public int deletePaymentList(List<String> payIds,List<String> bookIds);

    //mypage payment 결제취소 상태 갱신(Update) , 파라미터 payId, clientId
    //public int UpdatePaymentStatus(String payId,String clientId,List<String> bookIds);

    public int partialCancel(String payId,String clientId,String bookIds);

    public int allCancel(String payId,String clientId);

    public  List<PaymentQuantityVO> selectPaymentQuantity(List<String> payIds);

}
