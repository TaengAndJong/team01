import FormTag from "@util/formTag.jsx";
import {validID, validPW,checkDuplicate, validatePasswordMatch} from "@util/validation.jsx";
import React, {useEffect, useState} from "react";
import {useModal} from "../../../common/modal/ModalContext.jsx";
import axios from "axios";



const IdAndPw = ({defaultInfo,setUserInfo,msg,setMsg,errorData})=>{
    console.log("defaultInfo",defaultInfo);
    console.log("msg,setMsg,errorData",msg,setMsg,errorData);


    // 1. 변경 버튼을누른다
    // 2. 비밀번호 변경 UI를 띄운다.
    // 3. 변경할 비밀번호를 입력한다
    // 4. 두 번입력 동일 검증 확인
    // 5. 서버로 put fetch 요청 전송해서 갱신


    //비밀번호 변경 상태관리 변수
    const [newPassword, setNewPassword] = useState({
        newPassword: "",
        newPasswordConfirm: "",
        currentPw:""
    });

    //비밀번호변경 Ui 토글관리
    const [pwTag,setPwdTag] = useState(false);

    //input onChange 핸들러
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log("name,value",name, value);
        setNewPassword(prev => ({
            ...prev,        // 기존 객체 복사
            [name]: value   // 바꿀 값만 업데이트
        }));

    };


    useEffect(()=>{

        // 비밀번호 유효성 검사
        const pwValidation = validPW(newPassword.newPassword);
        console.log("pwValidation-----------개인정보 비밀번호변경",pwValidation);

        // newPassword의 newPassword와 newPasswordConfirm의 동일여부 판단
        const pwdConfirm =
            newPassword.newPasswordConfirm.trim() !== ""
                ? validatePasswordMatch(newPassword.newPassword, newPassword.newPasswordConfirm)
                : { valid: true, message: "" }; // 아직 확인칸이 비어있으면 비교 안함
        console.log("pwdConfirm-----------개인정보 비밀번호변경",pwdConfirm);
        //메시지 데이터 갱신
        setMsg((prev) => ({
            ...prev,
            errorpwdConfirm: pwdConfirm.valid ? "" : pwdConfirm.message,// 동일하지않으면 에러메시지 표시.
            errorpwd: pwValidation.valid ? "" : pwValidation.message,   // 동일하지않으면 에러메시지 표시.
        }));

    },[newPassword])


    //비밀번호 변경 UI열기
    const openPwTag = async() => {
        // 현재비밀번호 검증
        console.log("현재비밀번호 검증 : ",newPassword.currentPw);
        //서버로 검증요청 보내기?
        const response = await axios.post("/api/mypage/checkPassword", {
            currentPw: newPassword.currentPw, // 입력받은 현재 비밀번호
        });

        //

        //이전상태값이 false면 true, true면 false
        setPwdTag((prev)=>!prev);
    }

    //비밀번호 변경 검증 및 fetch 요청보내기
    const updatePw = async () => {
        // 비밀번호 갱신 서버로 보내기

        try{
            const response = await axios.put("/api/mypage/changePassword",{
                password:newPassword.newPassword,
            })
            console.log("response------------- 비밀번호 갱신 비동기요청",response.data);

        }catch(e){
            console.error("비밀번호 변경 실패:", error);
        }

    }



    return (
        <>
            {/*id*/}
            <div className="d-flex align-items-center mb-2 justify-content-start">
                <FormTag label="아이디" labelClass="form-title" className="form-control w-auto" name="clientId" type="text"
                         value={defaultInfo.clientId}
                        readOnly
                        aria-readonly="true"/>
           </div>
           {/*pw*/}
            <div className="d-flex flex-wrap align-items-center mb-2">
                <label className="form-title">비밀번호</label>
                <input type="password" className="form-control w-auto" name="currentPw" value={newPassword.currentPw}
                placeholder={"현재 비밀번호 입력"} onChange={handleInputChange}/>
                <button type="button" className="btn custom-btn00 pw-change ms-1 py-2" onClick={openPwTag}>확인
                </button>
                <p className={"info d-flex align-items-center"}>
                    <i className={"icon info"}><span className={"sr-only"}>안내</span></i>
                    비밀번호를 변경하려면 현재비밀번호를 확인해주세요.
                </p>
                {pwTag && (
                    <>
                        <div className="d-flex  align-items-center pwChange">
                            <label className="form-title">새비밀번호</label>
                            <input
                                type="password"
                                className="form-control me-3"
                                name="newPassword"
                                placeholder="새 비밀번호 입력"
                                onChange={handleInputChange}
                                value={newPassword.newPassword}
                            />
                            <label className="form-title">비밀번호확인</label>
                            <input
                                type="password"
                                className="form-control "
                                name="newPasswordConfirm"
                                placeholder="새 비밀번호 입력 확인"
                                onChange={handleInputChange}
                                value={newPassword.newPasswordConfirm}
                            />
                            <button type="button" className="btn custom-btn00 submit ms-1 py-2" onClick={updatePw}>변경
                            </button>
                        </div>
                        <p className={"info d-flex align-items-center"}><i className={"icon info"}><span className={"sr-only"}>안내</span></i>{msg.errorpwd}</p>
                    </>
                )}

            </div>
            <div className="d-flex align-items-center mb-2">
                <FormTag label="이름" labelClass="form-title" className="form-control w-auto" name="clientName"
                         value={defaultInfo.clientName}
                         readOnly
                         aria-readonly="true"
                />
            </div>

            {/*     */}


        </>
    )

}

export default IdAndPw;