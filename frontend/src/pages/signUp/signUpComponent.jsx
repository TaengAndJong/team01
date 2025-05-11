
import { useState} from "react";
import {useNavigate} from "react-router-dom";
import Btn from "@util/reuseBtn.jsx";
import IdAndpw from "@pages/signUp/components/idAndpw.jsx";
import "@assets/css/signUp/signUp.css"
import Birth from "@pages/signUp/components/birth.jsx";
import Tel from "./components/tel.jsx";
import Email from "./components/email.jsx";
import Address from "./components/address.jsx";
import StaffConfirm from "./components/staffConfirm.jsx";


const SignUpComponent = () => {
    const navigate = useNavigate();
    // formInfoData를 부모 컴포넌트로부터 props로 받아온다고 가정합니다.
    const [formData,setFormData] = useState({
        clientId: "",
        password: "",
        passwordConfirm: "",
        clientName:"",
        staffId:"",
        roleId:`ROLE_CLIENT`,
        email: "",
        birth:"",
        tel:"",
        addr:"",
        zoneCode:"",
        detailAddr:"",
        // joinDate:"",
        picture:"",
    });

    //에러 상태 초기화 관리
    const [msg, setMsg] = useState({
        errorId:"",
        errorpwd:"",
        errorpwdConfirm:"",
        errorEmail:"",
        errorAddr:"",
        errorTel:"",
        errorMemNum:"",
        errorBirth:"",
        memberMsg:""
    });
//signUp post로 비동기 요청보내기
    const handleSignUp = async () => {
        try {
            const response = await fetch("/api/signUp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData), // formInfoData를 JSON으로 변환하여 전송
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const result = await response.json(); // 서버에서 반환된 JSON 데이터 처리
            console.log("result-------backend to front",result); // 서버에서 받은 응답 확인
        
            //서버에서 반환하는 json 객체에 success :  true로 설정해줘야함
            if (result.success) {
                alert(`회원가입이 성공적으로 완료되었습니다! : ${result.message}` );
                // 성공 시 추가 작업 (예: 로그인 페이지로 이동)
                navigate("/");
            } else {
                // success : false
                alert(`회원가입 실패: ${result.message}`);
            }
        } catch (err) {
            console.error("회원가입 오류:", err);
            alert("회원가입 중 오류가 발생했습니다.");
        }
    };


    return (
        <>
            <div className="text-center custom-border content-inner">
                <strong className="d-block title-border mb-5">회원가입</strong>
                <form className="">
                    <IdAndpw formData={formData} setFormData={setFormData} msg={msg} setMsg={setMsg}/>
                    <Birth formData={formData} setFormData={setFormData} msg={msg} setMsg={setMsg}/>
                    <Tel formData={formData} setFormData={setFormData} msg={msg} setMsg={setMsg}/>
                    <Email formData={formData} setFormData={setFormData} msg={msg} setMsg={setMsg}/>
                    <Address formData={formData} setFormData={setFormData} msg={msg} setMsg={setMsg}/>
                    <StaffConfirm formData={formData} setFormData={setFormData} msg={msg} setMsg={setMsg}/>
                </form>
                <div className="d-flex justify-content-center w-100 mt-4">
                    <Btn type="submit" text="회원가입" className="btn-primary me-2" id="signup"  onClick={handleSignUp}/>
                    <Btn type="reset" text="취소" className="btn-danger" id="reset"  />
                </div>
            </div>

        </>
    )
}
export default SignUpComponent;