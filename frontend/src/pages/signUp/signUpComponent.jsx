
import React, { useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import Btn from "@util/reuseBtn.jsx";
import IdAndpw from "@pages/signUp/components/idAndpw.jsx";
import "@assets/css/signUp/signUp.css"
import Birth from "@pages/signUp/components/birth.jsx";
import Tel from "./components/tel.jsx";
import Email from "./components/email.jsx";
import Address from "./components/address.jsx";



const SignUpComponent = () => {
    const navigate = useNavigate();
    // formInfoData를 부모 컴포넌트로부터 props로 받아온다고 가정
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

    //modal

    const [errorData, setErrorData] = useState("");


//signUp post로 비동기 요청보내기
    const handleSignUp = async (e) => {
        e.preventDefault();
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
    
    // 아이디, 회원번호 검증
    const handleConfirm = async (key, value,addData = {}) => {
        console.log(key, value);
        //formData에 입력된 객체의 값을 가져와서 , URLSearchparams를 이용해 쿼리스트링으로 변경해 서버로 전송해야 함
        //URLSearchparams는 문자열을 파라미터로 받아야 함 ==> 객체에 담아서 key=value 형태로 담아야 함
        const params= new URLSearchParams({[key]:value});

        // 추가 데이터가 있다면 파라미터에 append
        for (const [addKey, addValue] of Object.entries(addData)) { // 객체데이터를 배열구조로 구조분해할당하여 추가 데이터 params에 담아주기
            if (addValue !== undefined && addValue !== null && addValue !== "") {
                console.log("addKye, addValue-----------------",addKey, addValue);
                params.append(addKey, addValue);
            }
        }

        console.log("params--------",params);
        console.log("params--------",params.toString());

        try{
            // 쿼리스트링으로 서버로 검증할 파라미터 fetch로 넘겨주기
            const response = await fetch(`/api/signUp/validate?${params.toString()}`, {
                method: "get",
            })
            //통신 실패
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            //통신 성공시 받아오는 결과 데이터
            const result = await response.json(); // 서버에서 반환된 JSON 데이터 처리
            console.log("result-------backend to front",result); // 서버에서 받은 응답 확인
            //모달 띄우기  ==>  true 이면 중복인 상태, false이면 사용가능한 상태
            if(result){
                console.log("result.message",result.message);
                //객체 형태
                setErrorData({
                    message: result.message,
                })
            }
        //    console.log("errorData ",errorData);

        }catch(err){
            console.error(err);
        }
        //end
    }

    // console.log("signupComponent ---------------------------------------")
    // console.log("formData :", formData);
    // console.log("signupComponent ---------------------------------------")



    return (
        <>
            <div  className="text-center custom-border content-inner">
                <form className="">
                    <fieldset>
                        <legend className="d-block title-border mb-5">회원가입</legend>
                        <IdAndpw formData={formData} setFormData={setFormData} msg={msg} setMsg={setMsg} errorData={errorData} handleConfirm={handleConfirm}/>
                        <Birth formData={formData} setFormData={setFormData} msg={msg} setMsg={setMsg}/>
                        <Tel formData={formData} setFormData={setFormData} msg={msg} setMsg={setMsg}/>
                        <Email formData={formData} setFormData={setFormData} msg={msg} setMsg={setMsg}/>
                        <Address formData={formData} setFormData={setFormData} msg={msg} setMsg={setMsg}/>
                        {/*<StaffConfirm formData={formData} setFormData={setFormData} msg={msg} setMsg={setMsg} handleConfirm={handleConfirm}/>*/}
                        <div className="d-flex justify-content-center w-100 mt-4">
                            <Btn type="submit" text="회원가입" className="btn btn-dark me-2" id="signup"
                                 onClick={handleSignUp}/>
                            <Link to="/" className="btn btn-danger">취소</Link>
                        </div>
                    </fieldset>
                </form>

            </div>

        </>
    )
}
export default SignUpComponent;