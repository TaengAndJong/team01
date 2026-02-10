import FormTag from "@util/form/formTag.jsx";
import Select from "react-select";
import React, {useEffect, useState} from "react";


const Email=({email,onChangeEmail})=>{

    // 초기값 value를 이메일 아이디랑 주소로 설정

    //이메일
    const [editEmail, setEditEmail] = useState({
        emailId: "",
        emailAddrInput: "",
        emailAddrSelect: "직접선택",
    });
    //이메일 수정 UI 관리
    const [isEditEmail, setIsEditEmail] = useState(true);


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
    },[email]); // 이메일 값이 갱신되면 변경되도록 의존성 배열에 email 넣어줘야함


    // 이메일 유효성 검사 및 중복 검사
    const inputChangeHandler = (e)=>{

        //이메일 입력 형식 사전 필터
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
            return; // 입력 불가시 코드 전체 종료해야 setEditEmail 함수가 실행이 되지 않아 값이 안 덮이게 되나 ?
        }
            setMsg({
                valid: true,
                message: ""
            })



        //...(스프레드 연산자)는 객체를 "펼쳐서" 새로운 객체에 병합하거나 추가하는 역할을 합니다.
        setEditEmail((prev) => ({
            ...prev,
            [name]: inputFilterVal, //불필요한 문자 필터(제거)한 값 반영
        }));

        //end
    }

    //react-select 컴포넌트 전용 핸들러: 리액트 셀렉트 컴포넌트는 selectedOption = { value: 'naver.com',label: 'naver.com'} 의 객체형태로 값 전달
    const selectChangeHandler = (selectOption)=>{

        const selectValue=selectOption.value;
        console.log("selectValue",selectValue);
        //select로 이메일주소를 선택한경우, input과 select 값을 동일하게 갱신 (상태갱신 예약)
        setEditEmail((prev)=>({
            ...prev,
            emailAddrInput: selectValue === '직접입력' ? '': selectValue,  // 선택값이 "직접 입력" 일 경우와 아닐 경우
            emailAddrSelect:selectValue
        }));

    }

    
    //해결해야할 문제 
    /*
    * 1) 이메일 수정할 때 기존에 입력된 문자가 한글을 누르면 삭제됨  --> ime 때문에 생기는 부분이라고함
    * 2) 리액트에서는 자식컴포넌트에서 부모 컴포넌트로 계산된 값을 보내는 방식을 추천 
    * 
    * */
    
    

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
                        readOnly={""}
                        value={editEmail.emailId}
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
                        onChange={(selectOption) => selectChangeHandler(selectOption)} // selectChangeHandler 과 동일
                        options={[
                            {value: '직접입력', label: '직접입력'},
                            {value: 'naver.com', label: 'naver.com'},
                            {value: 'google.com', label: 'google.com'},
                            {value: 'daum.net', label: 'daum.net'},
                            {value: 'thebook.store', label: 'thebook.store'},
                        ]}
                    />

                    {!isEditEmail && (
                        <button onClick={handleEditClick}>변경</button>
                    ) }
                    
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