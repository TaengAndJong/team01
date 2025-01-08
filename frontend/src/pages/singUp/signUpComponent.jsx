
import {createContext, useEffect, useReducer, useState} from "react";
import Btn from "../../util/reuseBtn.jsx";
import SignUpInfo from "./components/signUpInfo.jsx";





const SignUpComponent = () => {

    const [data, setData] = useState();
    // formInfoData를 부모 컴포넌트로부터 props로 받아온다고 가정합니다.
    const [formInfoData,setFormInfoData] = useState({
        clientId: "",
        password: "",
        passwordConfirm: "",
        passwordErrorMessage: "",
        clientName:"",
        staffId:"",
        roleId:`ROLE_CLIENT`,
        email: "",
        birth:"",
        tel:"",
        addr:"",
        zoneCode:"",
        detailAddr:""
    });

    // GET 요청 처리
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/signUp");

                console.log(response);

                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }

                const contentType = response.headers.get("content-type");
                let result;

                if (contentType && contentType.includes("application/json")) {
                    result = await response.json(); // JSON 응답 처리
                } else {
                    result = await response.text(); // 텍스트 응답 처리
                }

                setData(result);
                console.log("Fetched data:", result);
            } catch (err) {
                setError(err.message);
                console.error("Error fetching data:", err);
            }
        };

        fetchData();
    }, []); // 빈 의존성배열 사용

//signUp post로 비동기 요청보내기
    const handleSignUp = async () => {
        try {
            const response = await fetch("/api/signUp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formInfoData), // formInfoData를 JSON으로 변환하여 전송
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
            } else {
                // success : false
                alert(`회원가입 실패: ${result.message}`);
            }
        } catch (err) {
            console.error("회원가입 오류:", err);
            alert("회원가입 중 오류가 발생했습니다.");
        }
    };


    // value로 전달하는 객체는 자식 컴포넌트에서 사용할 수 있는 데이터들을 포함하는 객체
    //formData: 상태 객체로, 폼의 입력 값들을 저장
    //dispatch: 상태를 변경하는 함수입니다. 자식 컴포넌트에서 dispatch를 호출하여 액션을 보내면, 리듀서에서 상태를 업데이트
    //actionTypes: 액션 타입을 정의한 객체입니다. 이 객체는 상태를 변경할 때 액션 타입을 일관되게 사용할 수 있도록 도와줌
    return (
        <>
            <div>
                <span>{data}</span>
                <SignUpInfo formInfoData={formInfoData} setFormInfoData={setFormInfoData} />
                <Btn text="회원가입" type="submit" onClick={handleSignUp} />
            </div>

        </>
    )
}
export default SignUpComponent;