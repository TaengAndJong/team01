
import {createContext, useEffect, useReducer, useState} from "react";
import Btn from "../../util/reuseBtn.jsx";
import SignUpInfo from "./components/signUpInfo.jsx";



//1 formData 초기값 설정 ==> useStatus 사용하지말고 객체로 전달, useStatus를 컴포넌트함수 외부에 사용하면 에러
const initialState  = {
    clientId : "",//아이디
    roleId : "",//
    password : "",//비밀번호
    passwordConfirm : "",//비밀번화확인 (디비로 안넘어감)
    clientName :"",// 사용자 이름
    tel : "",//전화번호
    ZONECODE : "",//우편번호
    addr : "",// 기본주소
    detailAddr : "",// 상세주소
    picture:"", // 기본이미지 또는 다른 이미지
    joinDate:"", // 가입일
    status:"", // "일반회원","사원"  // --> 일반회원일 경우 ROLE_CLIENT, 사원일 경우 ROLE_ADMIN , 관리자일 경우 ROLE_ADMIN
    staffId:"",// 사원번호
}



const SignUpComponent = () => {

    const [data,setData] = useState();

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





    // value로 전달하는 객체는 자식 컴포넌트에서 사용할 수 있는 데이터들을 포함하는 객체
    //formData: 상태 객체로, 폼의 입력 값들을 저장
    //dispatch: 상태를 변경하는 함수입니다. 자식 컴포넌트에서 dispatch를 호출하여 액션을 보내면, 리듀서에서 상태를 업데이트
    //actionTypes: 액션 타입을 정의한 객체입니다. 이 객체는 상태를 변경할 때 액션 타입을 일관되게 사용할 수 있도록 도와줌
    return (
        <>
            <div>
                <span>{data}</span>
                <SignUpInfo/>
                <Btn text="회원가입" type="submit" />
            </div>

        </>
    )
}
export default SignUpComponent;