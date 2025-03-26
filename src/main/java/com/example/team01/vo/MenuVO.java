package com.example.team01.vo;

import lombok.*;
import java.io.Serializable;


@ToString
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MenuVO implements Serializable {

    private String menuId; // 메뉴 ID == endPoint
    private String menuName; // 메뉴명
    private String menuPath; // 메뉴 경로
    private String menuDepth; // 메뉴 쉰위
    private String menuType; // 메뉴 종류 : 관리자, 사용자
    private String menuVisible; // 메뉴 출력여부

}
