package com.example.team01.vo;

import lombok.*;
import lombok.extern.slf4j.Slf4j;

import java.io.Serializable;



@Slf4j
@ToString
@Getter
@Setter
@NoArgsConstructor
public class AuthVO implements Serializable {

    //디비에 저장하지 않고, 서버와 클라이언트 간 데이터를 전달하는 객체
    private boolean isAuthenticated;
    private Object userData;

    public AuthVO(boolean isAuthenticated, Object userData) {
        this.isAuthenticated = isAuthenticated;
        this.userData = userData;
    }

}
