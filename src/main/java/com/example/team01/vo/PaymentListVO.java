package com.example.team01.vo;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;


@AllArgsConstructor
@NoArgsConstructor
@Data
public class PaymentListVO implements Serializable {

    //펼친상태(flat한 상태로 구현하는게 나음

    public Long payId; // payment와 조인할 fk
    public Long bookId; // book과 조인할 fk
    public int quantity; //기본값 0으로 디비에 설정 되어있음
    private String bookCateNm;
    private String bookCateDepth;
    private String bookName;
    private String author;
    private Integer bookPrice;
    private String publishDate;
    private String roleId;
    private String cateId;
    private String bookImgPath;

    private Integer payAccount; // Integer 타입은 null 방지해줌
    private String payStatus;
    private String partPayStatus;
    private String payDate;
    private String payMethod;
    private String payUpdateDate;
    private Long addrId;
    private String clientId;


    private String addr;
    private String addrType;
    private String detailAddr;
    private String zoneCode;

    private int totalBookCount;
    private int cancelPayAccount;
    private int resultPayAccount;

    //string으로 들어오는 bookId 를 Long 타입으로 변환
    public void setBookId(String bookId) {
        this.bookId = (bookId != null && !bookId.isEmpty())
                ? Long.parseLong(bookId)
                : null;
    }
}
