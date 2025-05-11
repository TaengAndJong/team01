import Select from 'react-select';
import React,{useState,useEffect} from "react";

import Btn from "@util/reuseBtn.jsx";
import FormTag from "@util/formTag.jsx"
import {validID, validPW, validEachTel,checkDuplicate, validatePasswordMatch} from "@util/validation.jsx";
import DaumPostcode from "@util/daumPostcode.jsx";
import {generateOptions} from "@util/selectDate.jsx";
import IdAndpw from "@pages/signUp/components/idAndpw.jsx";
import Birth from "@pages/signUp/components/birth.jsx";
import Address from "@common/address.jsx";
import StaffConfirm from "@pages/signUp/components/staffConfirm.jsx";
import Email from "@common/email.jsx";
import Tel from "@common/tel.jsx";



const SignUpInfo = ({formData,setFormData}) => {

    useEffect(() => {
    }, [formData]);  // formInfoData가 변경될 때마다 실행












//사원여부 --> 이름, 생년월일, 전화번호, 사원번호로 조회하여 확인하기



    console.log("formData", formData);
    //
    return(
        <>

        </>
    )
}

export default SignUpInfo;


//react -select https://react-select.com/home
// React-Select는 기본적으로 name 속성을 전달하지 않으므로, onChange 핸들러에서 name 정보를 가져오려면 별도의 설정이
// Select 컴포넌트에 inputId 속성을 사용하거나, onChange 핸들러의 두 번째 매개변수를 활용
