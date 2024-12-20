package com.example.team01.vo;

import lombok.*;
import jakarta.persistence.Id; // 관계형 디비에서 사용
import java.io.Serializable;

@ToString
@Getter // 은닉화된 정보를 캡슐화
@Setter
@NoArgsConstructor//기본생성자
@AllArgsConstructor //파라미터로 받는 생성자 전부 생성, 객체 생성시 모든 필드 초기화
public class RoleVO implements Serializable {

    @Id
    String roleId;
    String roleName;

}
