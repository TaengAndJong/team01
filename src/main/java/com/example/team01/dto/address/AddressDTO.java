package com.example.team01.dto.address;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder //new연산자 + 생성자()메서드를 생성하지 않고 값 설정 가능하게함
public class AddressDTO {

    private String addrId; //
    private String clientId; // 배송지 주소를 조회 할때 사용하는 필드로 (컨트롤러에서 가져오는 파라미터를 매핑)  mybatis가 참조하는 필드
    private String addrType;
    private String addr;
    private String zoneCode;
    private String detailAddr;

}
