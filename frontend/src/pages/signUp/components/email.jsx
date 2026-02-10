import FormTag from "../../../util/form/formTag.jsx";
import Select from "react-select";
import React, {useEffect, useState} from "react";


const Email=({formData,setFormData})=>{

    //이메일
    const [email, setEmail] = useState({
        emailId: "",
        emailAddrInput: "",
        emailAddrSelect: "직접입력",
    });

    const [msg, setMsg] = useState({}); // 초기값은 빈 문자열

    //사용자 조작 상태 : 사용자가 입력한 적이 없는 상태로 초기값
    const [emailTouched, setEmailTouched] = useState(false); 
    
    //useEffect의 역할 : 상태변화의 결과에 반응, 서버호출, 외부 Effect 처리 용도로 onChange 이벤트를 대신해서 사용하면 안 됨
    useEffect(() => {

        //해당 필터를 통과하면 formData email에 넣어줄 전체 이메일 주소 결합하기
        const combineEmail=
            email.emailAddrSelect !== "직접입력"
            ? `${email.emailId}@${email.emailAddrSelect}`
            : `${email.emailId}@${email.emailAddrInput}`;

        console.log("combineEmail",combineEmail);

        // 하나의 이메일 주소로 결합하여 formData한번만 갱신
        setFormData(prev => ({
            ...prev,
            email: combineEmail,
        }))


    },  [email]); // email가 변경될 때 실행


    // onChaneg 의 역할 : 입력 제어와 상태변경
    // 이메일 유효성 검사 및 중복 검사 ( input[type=text] 에 대한 이벤트 핸들러)
    const inputChangeHandler = (e)=>{
        setEmailTouched(true); // 사용자가 조작함
        console.log("이메일 입력",e.target.name,e.target.value);
        // 이벤트 타겟 객체 구조분해 할당
        const {name, value} = e.target;
        // 입력에 대한 필터 결과를 저장할 변수 :  검증이 아닌 불필요한 입력값을 사전 필터링하는 용도
        let inputFilterVal;
        //이메일 아이디 또는 이메일 주소
        if (name === "emailId" || name === "emailAddrInput") {
            //입력된 이메일 아이디값에 대한 불필요한 텍스트 제거 ( 사전필터 )
            inputFilterVal= value.replace(/[^a-zA-Z0-9._-]/g, "");
        }

        // 사용자가 잘못된 값을 입력할 경우 안내할 메시지
        if(value !== inputFilterVal){ // 실제 입력된 값과 필터된 값이 다르면 
            //사용자에게 보여줄 메시지 갱신 예약
            setMsg({
                valid: false,
                message: "한글 입력 불가"
            });
        }else{
            setMsg({
                valid: true,
                message: ""
            })
        }

        //이메일 객체에 반영
        setEmail((prev) => ({
            ...prev,
            [e.target.name]: inputFilterVal, //불필요한 문자 필터(제거)한 값 반영
        }));
        //end
    }

    //react-select 컴포넌트 전용 핸들러: 리액트 셀렉트 컴포넌트는 selectedOption = { value: 'naver.com',label: 'naver.com'} 의 객체형태로 값 전달
    const selectChangeHandler = (selectOption)=>{

        const selectValue=selectOption.value;
        console.log("selectValue",selectValue);
        //select로 이메일주소를 선택한경우, input과 select 값을 동일하게 갱신 (상태갱신 예약)
        setEmail((prev)=>({
            ...prev,
            emailAddrInput: selectValue === '직접입력' ? '': selectValue,  // 선택값이 "직접 입력" 일 경우와 아닐 경우
            emailAddrSelect:selectValue
        }));

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
                    value={email?.emailId}
                    onChange={inputChangeHandler}
                    placeholder="이메일아이디"
                />
                <span className="d-inline-flex w-auto align-items-center mx-1 seperator" id="at" aria-hidden="true">@</span>
                <FormTag
                    label="이메일주소"
                    labelClass="sr-only" className="form-control col-3"
                    id="emailAddrInput"
                    name="emailAddrInput"
                    value={email?.emailAddrInput}
                    // readOnly={email?.emailAddrSelect === '직접입력' ? false : true}
                    readOnly={email?.emailAddrSelect !== '직접입력'}
                    onChange={inputChangeHandler}
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
                    value={{value: email?.emailAddrSelect, label: email?.emailAddrSelect}}
                    onChange={(selectOption) => selectChangeHandler(selectOption)} // selectChangeHandler 과 동일
                    options={[
                        {value: '직접입력', label: '직접입력'},
                        {value: 'naver.com', label: 'naver.com'},
                        {value: 'google.com', label: 'google.com'},
                        {value: 'daum.net', label: 'daum.net'},
                    ]}
                />
                {msg.message && (
                    <div className="d-flex align-items-center my-2" role="alert">
                        <i className="icon info me-2"></i>{msg.message}
                    </div>
                )}
            </fieldset>
        </>
    )
}

export default Email;