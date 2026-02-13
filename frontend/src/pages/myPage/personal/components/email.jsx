import FormTag from "@util/form/formTag.jsx";
import Select from "react-select";
import React, {useEffect, useState} from "react";


const Email=({email,setUserInfo})=>{

    // 초기값 value를 이메일 아이디랑 주소로 설정

    //이메일
    const [editEmail, setEditEmail] = useState({
        emailId: "",
        emailAddrInput: "",
        emailAddrSelect: "직접선택",
    });

    // 사용자에게 알릴 메시지 관리
    const [msg,setMsg]=useState({});

    //email 상태 초기화 값 설정 ( 처음 렌더링 될 때 한번만 실행 )
    useEffect(() => {

        if(!email) { return; } // 데이터 없는 코드 선행 조건 코드실행 방지

        // email 데이터가 있으면 email 주소 "@"을 기준으로 구조분해 할당
        const [emailId, emailAddr] =email.split("@");

        // EmailData의 값에 설정해주기
        setEditEmail({
            emailId:emailId || "",
            emailAddrInput:emailAddr || "",
            emailAddrSelect: emailAddr || "", // 초기값은 input 과 동일
        });
    },[]); // 이메일 값이 갱신되면 변경되도록 의존성 배열에 email 넣어줘야함

    //이메일 완성값 부모로 전달
    useEffect(() => {
        
        //input 과 셀렉트박스에 입력된 주소값 설정
        const domain =
            editEmail.emailAddrSelect === "직접입력"
                ? editEmail.emailAddrInput
                : editEmail.emailAddrSelect;

        // 이메일 아이디와 주소 둘 중 하나라도 없으면  실행 종료
        if (!editEmail.emailId || !domain) return;

        // 조건문 통과하면 전체 이메일로 결합
        const combineEmail = `${editEmail.emailId}@${domain}`;
        
        //부모에 상태 갱신
        setUserInfo(prev => ({
            ...prev,
            email: combineEmail
        }));
        
    }, [editEmail.emailId, editEmail.emailAddrInput, editEmail.emailAddrSelect]);
        //의존성은 객체의 요소에 필요한 값만 작성하여 문자열 비교를 하도록 해야 무한렌더링 방지 가능


    // 이메일 유효성 검사 및 중복 검사
    const inputChangeHandler = (e)=>{

        //이메일 입력 형식 사전 필터
        console.log("이메일 입력",e.target.name,e.target.value);
        // 이벤트 타겟 객체 구조분해 할당
        const {name, value} = e.target;

        // 필터 전 값 변경
        setEditEmail(prev => ({
            ...prev,
           [name]:value
        }));

        // 갱신 예약된 값에 대한 간단한 이메일 입력 형식만 검사
        const emailRegex = /^[a-zA-Z0-9._-]*$/;

        // 사용자에게 안내
        if (!emailRegex.test(value)) {
            setMsg({
                valid: false,
                message: "영문, 숫자만 입력 가능합니다"
            });
        } else {
            setMsg({
                valid: true,
                message: ""
            });
        }
        
        // onChange 이벤트 시에, 변경된 값을 먼저 반영하지 않고 중간에 검사 후 갱신값을 반영하면 
        // 선 입력해둔 글자가 지워지는 현상이 발생함
    //end
    };

    //react-select 컴포넌트 전용 핸들러: 리액트 셀렉트 컴포넌트는 selectedOption = { value: 'naver.com',label: 'naver.com'} 의 객체형태로 값 전달
    const selectChangeHandler = (e)=> {
        const selectValue = e.value;
        //select로 이메일주소를 선택한경우, input과 select 값을 동일하게 갱신 (상태갱신 예약)
        setEditEmail((prev) => ({
            ...prev,
            emailAddrInput: selectValue === '직접입력' ? '' : selectValue,
            emailAddrSelect: selectValue
        }));
        //end
    }

    return(
        <>

            {/*이메일*/}
            <fieldset className="email d-flex align-items-center mb-2 flex-wrap">
                <legend className="form-title">이메일</legend>
                <div className="d-flex w-100">
                    <FormTag
                        label="이메일아이디"
                        labelClass="sr-only" className="form-control w-25"
                        name="emailId"
                        id="emailId"
                        value={editEmail?.emailId}
                        onChange={inputChangeHandler}
                        placeholder="ex) 이메일아이디"
                    />
                    <span id="at" className="mx-1">@</span>
                    <FormTag
                        label="이메일주소"
                        labelClass="sr-only" className="form-control col-3"
                        id="emailAddrInput"
                        name="emailAddrInput"
                        value={editEmail?.emailAddrInput}
                        readOnly={editEmail?.emailAddrSelect !== '직접입력'}
                        onChange={inputChangeHandler}
                        placeholder="이메일주소"
                    />
                    <label htmlFor="emailAddrSelect" className="sr-only">
                        이메일 도메인 선택
                    </label>
                    <Select
                        className="ms-1 col-3"
                        id="emailAddrSelect"
                        name="emailAddrSelect"
                        value={{value: editEmail?.emailAddrSelect, label: editEmail?.emailAddrSelect}}
                        onChange={selectChangeHandler} // selectChangeHandler 과 동일
                        options={[
                            {value: '직접입력', label: '직접입력'},
                            {value: 'naver.com', label: 'naver.com'},
                            {value: 'google.com', label: 'google.com'},
                            {value: 'daum.net', label: 'daum.net'},
                            {value: 'thebook.store', label: 'thebook.store'},
                        ]}
                    />

                </div>
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