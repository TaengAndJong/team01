package com.example.team01.vo;

import lombok.*;
import java.io.Serializable;


@ToString
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AddressVO implements Serializable {

    private Long addrId; //
    private String clientId; // 배송지 주소를 조회 할때 사용하는 필드로 (컨트롤러에서 가져오는 파라미터를 매핑)  mybatis가 참조하는 필드
    private String addrType;
    private String addr;
    private String zoneCode;
    private String detailAddr;
    private String isdefault;

    // clientId를 client 테이블에서 조인해와야 하기때문에, clientVO객체 필드 작성
    // association을 선언된 필드들은 where 조건절에 값을 담을 수 없어서 ,AddressVO 객체 내부에 clientId 필드를 따로 작성해야함
    // 조인된 결과 (client 테이블의 값이 담김)
    private ClientVO client;

}
/*
* 주의사항 
* 조인 쿼리 사용시 1:1 관계, 1:N관계에 유의해서 VO객체 작성하기
* Mapper 에 resultMap 사용하기
* */