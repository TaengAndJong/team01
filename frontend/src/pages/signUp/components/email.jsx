import FormTag from "../../../util/form/formTag.jsx";
import Select from "react-select";
import React, {useEffect, useState} from "react";
import {emailAddrValidation, emailIdValidation} from "../../../util/validation/validationCommon.js";


const Email=({formData,setFormData})=>{

    //이메일
    const [email, setEmail] = useState({
        emailId: "",
        emailAddrInput: "",
        emailAddrSelect: "직접선택",
    });

    const [msg, setMsg] = useState({});

    //email
    useEffect(() => {

        console.log("1 ",email.emailAddrInput);
        const nextData = {
            emailId: email.emailId,
            emailAddrInput: email.emailAddrInput,
        }
        console.log("nextData",nextData);

        //이메일 아이디일경우
        if(nextData?.emailId){
            console.log("2",email.emailId);
          const emailIdValid = emailIdValidation(nextData.emailId);
            console.log("3",emailIdValid);
        }
        //이메일 주소를 직접 입력할경우
        if(email?.emailAddrInput){
            console.log("2",email.emailId);
            const emailAddrValid = emailAddrValidation(nextData.emailAddrInput);
            console.log("3",emailAddrValid);
        }
        //이메일 셀렉터를 통해 입력할경우

        //검증메시지 반영



    },  [email.emailId, email.emailAddrInput]); // email가 변경될 때 실행

    // 이메일 유효성 검사 및 중복 검사
    const handleEmailChange = (e)=>{

        //...(스프레드 연산자)는 객체를 "펼쳐서" 새로운 객체에 병합하거나 추가하는 역할을 합니다.
        setEmail((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
            ...(e.target.name === "emailAddrSelect" && { emailAddrInput: e.target.value }), // emailAddrSelect 처리
        }));

        //end
    }

    /*
    *  autoComplete  속성은 HTML표준(W3C)에 정의된 자동완성 힌트 토큰으로,
    *  해당 속성이 있는 요소의 입력값은 사용자식별자(아이디 또는 이메일 아이디 등)를 의미하고
    *  브라우저는 이전 저장된 계정정보, 비밀번호 관리자 정보 등을 의미에 맞게 제안해 줌
    *  --> 이 입력이 무엇인지 브라우저에게 알려주는 접근성 속성
    * */

    return(
        <>
            {/*이메일*/}
            <fieldset className="row col-12 mb-2 email-info">
                <legend className="form-title">이메일</legend>
                <FormTag
                    label="이메일아이디"
                    labelClass="sr-only" className="form-control col-3"
                    name="emailId"
                    id="emailId"
                    value={email.emailId}
                    onChange={handleEmailChange}
                    placeholder="이메일아이디"
                />
                <span className="d-inline-flex w-auto align-items-center mx-1" id="at" aria-hidden="true">@</span>
                <FormTag
                    label="이메일주소"
                    labelClass="sr-only" className="form-control col-3"
                    id="emailAddrInput"
                    name="emailAddrInput"
                    value={email.emailAddrInput}
                    onChange={handleEmailChange}
                    placeholder="이메일주소"
                />
                {/*select도 라벨 필수*/}
                <label htmlFor="emailAddrSelect" className="sr-only">
                    이메일 도메인 선택
                </label>
                <Select
                    className="ms-1 col-3"
                    id="emailAddrSelect"
                    name="emailAddrSelect"
                    value={{value: email.emailAddrSelect, label: email.emailAddrSelect}}
                    onChange={(selectedOption) => {

                        handleEmailChange({target: {name: 'emailAddrSelect', value: selectedOption.value}});
                    }}
                    options={[
                        {value: '직접선택', label: '직접선택'},
                        {value: 'naver.com', label: 'naver.com'},
                        {value: 'google.com', label: 'google.com'},
                        {value: 'daum.net', label: 'daum.net'},
                    ]}
                />

            </fieldset>
        </>
    )
}

export default Email;