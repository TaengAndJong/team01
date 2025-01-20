
import React, { useEffect, useState} from "react";
import Btn from "../../util/reuseBtn.jsx";
import SignUpInfo from "./components/signUpInfo.jsx";
import {useNavigate} from "react-router-dom";



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
            <div>
                <SignUpInfo formData={formData} setFormData={setFormData} />
                <Btn text="회원가입" type="submit" onClick={handleSignUp} />
            </div>

        </>
    )
}
export default SignUpComponent;