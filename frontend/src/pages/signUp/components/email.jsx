import FormTag from "../../../util/form/formTag.jsx";
import Select from "react-select";
import React, {useEffect, useState} from "react";


const Email=({formData,setFormData})=>{

    //이메일
    const [emailData, setemailData] = useState({
        emailId: "",
        emailAddrInput: "",
        emailAddrSelect: "직접선택",
    });
    //email
    useEffect(() => {
        if (emailData.emailId && emailData.emailAddrInput) {

            setFormData((prev) => ({
                ...prev,
                email: `${emailData.emailId}@${emailData.emailAddrInput}`,
            }));
        }
    },  [emailData.emailId, emailData.emailAddrInput]); // emailData가 변경될 때 실행

    // 이메일 유효성 검사 및 중복 검사
    const handleEmailChange = (e)=>{

        //...(스프레드 연산자)는 객체를 "펼쳐서" 새로운 객체에 병합하거나 추가하는 역할을 합니다.
        setemailData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
            ...(e.target.name === "emailAddrSelect" && { emailAddrInput: e.target.value }), // emailAddrSelect 처리
        }));

        //end
    }



    return(
        <>
            {/*이메일*/}
            <div className="row col-12 mb-2 email-info">
                <strong className="form-title">이메일</strong>
                <FormTag
                    label="이메일아이디"
                    labelClass="sr-only" className="form-control col-3"
                    name="emailId"
                    id="emailId"
                    value={emailData.emailId}
                    onChange={handleEmailChange}
                    placeholder="ex) 이메일아이디"
                />
                <span className="d-inline-flex w-auto align-items-center mx-1" id="at">@</span>
                <FormTag
                    label="이메일주소"
                    labelClass="sr-only" className="form-control col-3"
                    id="emailAddrInput"
                    name="emailAddrInput"
                    value={emailData.emailAddrInput}
                    onChange={handleEmailChange}
                    placeholder="ex) 이메일주소"
                />
                <Select
                    className="ms-1 col-3"
                    id="emailAddrSelect"
                    name="emailAddrSelect"
                    value={{value: emailData.emailAddrSelect, label: emailData.emailAddrSelect}}
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

            </div>
        </>
    )
}

export default Email;