
import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import Btn from "@util/form/reuseBtn.jsx";
import IdAndpw from "@pages/signUp/components/idAndpw.jsx";
import "@assets/css/signUp/signUp.css"
import Birth from "@pages/signUp/components/birth.jsx";
import Tel from "./components/tel.jsx";
import Email from "./components/email.jsx";
import Address from "./components/address.jsx";
import {useModal} from "../common/modal/ModalContext.jsx";
import {catchError} from "../../util/error/error.jsx";
import axios from "axios";
import StaffConfirm from "./components/staffConfirm.jsx";



const SignUpComponent = () => {
    const navigate = useNavigate();
    // formInfoData를 부모 컴포넌트로부터 props로 받아온다고 가정
    const [signInfo,setSignInfo] = useState({
        roleId:`ROLE_CLIENT`,
        addr: "",
        addrDetail:"",
        isStaff:"no",
        staffId:"",

    });

    //공통모달
    const {openModal,closeModal} = useModal();

    useEffect(() => {
        console.log("signInfo",signInfo);
    },[signInfo])

    //한글로 변경
    const korname = {
        clientId:"아이디",
        password:"비밀번호",
        clientName : "이름",
        email: "이메일",
        birth:"생일",
        tel:"연락처",
        addr:"주소",
        zoneCode:"우편번호",
        detailAddr:"상세주소",
    }

//signUp post로 비동기 요청보내기
    const submitSignUp = async (e) => {
        e.preventDefault();
        // 서버 전송 전 데이터 빈값 검증과 풀데이터 정규식 형식검증
        try {
            //signInfo에 담기전에 빈값 검증필요
            for (const [key, value] of Object.entries(signInfo)) {
                if (!value) {
                    const engtokorName = korname[key] || key; // korname[key] 를 사용해서 해당 객체의 value 값을 가져오기
                    openModal({
                        modalType: "error",
                        content:<>
                            <p>{engtokorName} 값이 비어있습니다.</p>
                        </>,
                        onConfirm: () => {closeModal()}
                    })
                    break; // 빈 값 발견 시 루프 종료
                }
            }

            // axios에서 signInfo를 Json으로 변경해 줌
            const response = await axios.post("/api/signup", signInfo,{
                headers: {
                    "Content-Type": "application/json",
                },
            });
            //서버에서 받아온 응답
            const result =  response.data; 

            //서버에서 반환하는 json 객체에 success :  true로 설정해줘야함
            if (result.success) {
                openModal({
                    modalType: "confirm",
                    content:<>
                                <p>회원가입이 성공적으로 완료되었습니다!</p>
                            </>,
                    onConfirm: () => {closeModal(); navigate("/");},
                })

            }
        } catch (err) {
            console.log("회원가입 에러",err);
            //에러처리
            catchError(err,{openModal,closeModal})

        }
    };

    return (
        <>
            <div  className="text-center custom-border content-inner">
                <form className="container">
                    <fieldset>
                        <legend className="d-block title-border mb-5">회원가입</legend>
                        <IdAndpw formData={signInfo} setFormData={setSignInfo}/>
                        <Birth formData={signInfo} setFormData={setSignInfo} />
                        <Tel formData={signInfo} setFormData={setSignInfo} />
                        <Email formData={signInfo} setFormData={setSignInfo} />
                        <Address formData={signInfo} setFormData={setSignInfo} />
                        <StaffConfirm formData={signInfo} setFormData={setSignInfo}/>
                        <div className="d-flex justify-content-center w-100 mt-4">
                            <Btn type="submit" text="회원가입" className="btn btn-dark me-2" id="signup"
                                 onClick={submitSignUp}/>
                            <Link to="/" className="btn btn-danger">취소</Link>
                        </div>
                    </fieldset>
                </form>

            </div>

        </>
    )
}
export default SignUpComponent;