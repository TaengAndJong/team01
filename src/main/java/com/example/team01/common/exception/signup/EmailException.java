package com.example.team01.common.exception.signup;

import com.example.team01.common.exception.common.BusinessException;



public class EmailException extends BusinessException {
    // 이메일에 관련한 예외처리
    public EmailException(String message) {
        super(message);
    }

}
