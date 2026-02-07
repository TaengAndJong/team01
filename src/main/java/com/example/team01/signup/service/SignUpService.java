package com.example.team01.signup.service;

import com.example.team01.signup.dto.staff.StaffConfirmRequest;
import com.example.team01.vo.SignUpVO;

public interface SignUpService {

    void insertUserData(SignUpVO signUpVO);
    void selectDuplicateId(String clientId);
    void selectStaffId(StaffConfirmRequest staff);

}
