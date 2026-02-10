import FormTag from "@util/form/formTag.jsx";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {pwConfirmValidation, pwvalidation} from "../../../../util/validation/validationCommon.js";



// 1. 변경 버튼을누른다
// 2. 비밀번호 변경 UI를 띄운다.
// 3. 변경할 비밀번호를 입력한다
// 4. 두 번입력 동일 검증 확인
// 5. 서버로 put fetch 요청 전송해서 갱신 ==> 비밀번호만 갱신되어도 수정완료 버튼 작동되게 하려면 ?

// 6. 비밀번호를 제외한 나머지 데이터 갱신

const IdAndPw = ({defaultInfo,onPasswordChanged})=>{

    //비밀번호 변경 상태관리 변수
    const [newPassword, setNewPassword] = useState({
        newPassword: "",
        newPasswordConfirm: "",
        currentPw:""
    });
    //메시지관리
    const [msg,setMsg]=useState({
        massage:"비밀번호 변경 시, 현재비밀번호를 확인해주세요."
    });
    //비밀번호변경 Ui 토글관리
    const [pwTag,setPwdTag] = useState(false);
    //비밀번호 변경 완료 시 , disabled 상태관리
    const [isDisabled, setIsDisabled] = useState(false);

    //input onChange 핸들러
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setNewPassword(prev => ({
            ...prev,        // 기존 객체 복사
            [name]: value   // 바꿀 값만 업데이트
        }));

    };



    //비밀번호 변경 UI열기
    const openPwTag = async() => {
        // 현재비밀번호 검증
        // console.log("현재비밀번호 검증 : ",newPassword.currentPw);
        try{
            //서버로 검증요청 보내기?
            const response = await axios.post("/api/mypage/checkPassword", {
                currentPw: newPassword.currentPw, // 입력받은 현재 비밀번호
            });


            setMsg(prev => ({
                ...prev,
                massage: response.data.msg
            }));
            //이전상태값이 false면 true, true면 false
            setPwdTag((prev)=>!prev);
        }catch(err){

            setMsg((prev) => ({
                ...prev,
                massage: "비밀번호 확인에 실패했습니다.",
            }));
        }

    }

    //비밀번호 변경 검증 및 fetch 요청보내기
    const updatePw = async () => {
        // 비밀번호 갱신 서버로 보내기

        try{
            const response = await axios.put("/api/mypage/changePassword",{
                newPassword:newPassword.newPassword,
            })
       
            setMsg(prev => ({
                ...prev,
                massage: response.data.msg
            }))

            //이전상태값이 false면 true, true면 false ==> 새 비밀번호 입력 UI 닫기 
            setPwdTag((prev)=>!prev);
            // 변경완료되면 input, button disable 속성 true로 변경
            setIsDisabled((prev)=>!prev);
            //개인정보가 변경됬는데 부모컴포너트인 EditInfo 한테 상태갱신을 알려줘야함!!
            onPasswordChanged();

        }catch(error){
            //에러처리
            console.error("비밀번호 변경 실패:", error);
        }

    }

    useEffect(()=>{

        // 비밀번호 유효성 검사
        const pwValidation = pwvalidation(newPassword.newPassword);
        console.log("pwValidation",pwValidation);

        // newPassword의 newPassword와 newPasswordConfirm의 동일여부 판단
        const pwdConfirm = pwConfirmValidation(newPassword.newPassword, newPassword.newPasswordConfirm)
        console.log("pwdConfirm",pwdConfirm);


        // 메시지 데이터 갱신
        setMsg((prev) => ({
            ...prev,
            errorpwdConfirm: pwdConfirm.valid ? "" : pwdConfirm.message,// 동일하지않으면 에러메시지 표시.
            errorpwd: pwValidation.valid ? "" : pwValidation.message,   // 동일하지않으면 에러메시지 표시.
        }));

    },[newPassword])




    return (
        <>
            {/*id*/}

                <div className="d-flex col-12 mb-2">
                    <FormTag label="아이디" labelClass="form-title col-2" id="clientId" className="form-control"
                             name="clientId" type="text"
                             value={defaultInfo.clientId}
                             readOnly
                             aria-readonly="true"/>
                </div>
                {/*pw*/}
                <div className="d-flex col-12  mb-2 flex-wrap">
                    <label className="form-title col-2">비밀번호</label>
                    <input type="password" className="form-control w-auto" id="currentPw" name="currentPw" value={newPassword.currentPw}
                    placeholder={"현재 비밀번호 입력"} onChange={handleInputChange} disabled={isDisabled} />
                    <button type="button" className="btn custom-btn00 pw-change ms-1 py-2" onClick={openPwTag}
                            disabled={isDisabled}
                    >{pwTag?"닫기":"확인"}
                    </button>
                    {msg.massage && !pwTag? (
                        <p className={"info align-items-center fw-bold d-flex"}>
                               <i className={"icon info mx-3"}><span className={"sr-only"}>안내</span></i>{msg.massage}
                        </p>
                    ):""}
                </div>

                {pwTag && (
                    <>
                        <div className="d-flex col-12  mb-2 align-items-center pwChange">
                            <label className="form-title col-2">새비밀번호</label>
                            <input
                                type="password"
                                id="newPassword"
                                className="form-control me-3"
                                name="newPassword"
                                placeholder="새 비밀번호 입력"
                                onChange={handleInputChange}
                                value={newPassword.newPassword}
                            />
                            <label className="form-title col-2 sr-only">비밀번호확인</label>
                            <input
                                type="password"
                                className="form-control "
                                id="newPasswordConfirm"
                                name="newPasswordConfirm"
                                placeholder="새 비밀번호 입력 확인"
                                onChange={handleInputChange}
                                value={newPassword.newPasswordConfirm}
                            />
                            <button type="button" className="btn custom-btn00 submit ms-1 py-2" onClick={updatePw}>변경
                            </button>
                        </div>
                        {msg.errorpwd || msg.errorpwdConfirm?
                            (
                                <p className={"info d-flex align-items-center fw-bold my-2"}><i className={"icon info me-2"}><span
                                    className={"sr-only"}>안내</span></i>
                                    {msg.errorpwd || msg.errorpwdConfirm}
                                </p>
                            ): ""
                        }
                    </>
                )}

                <div className="d-flex col-12  mb-2">
                    <FormTag label="이름" labelClass="form-title" id="clientName" className="form-control w-auto" name="clientName"
                             value={defaultInfo.clientName}
                             readOnly={true}
                             aria-readonly="true"
                    />
                </div>

            {/*     */}


        </>
    )

}

export default IdAndPw;