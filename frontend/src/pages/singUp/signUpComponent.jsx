
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
    zipCode : "",//우편번호
    addr : "",// 기본주소
    detailAddr : "",// 상세주소
    picture:"", // 기본이미지 또는 다른 이미지
    joinDate:"", // 가입일
    status:"", // "일반회원","사원"  // --> 일반회원일 경우 ROLE_CLIENT, 사원일 경우 ROLE_ADMIN , 관리자일 경우 ROLE_ADMIN
    staffId:"",// 사원번호
}

// 2. formdata의 상태관리 Dispatch 작성


const reducer = (formData, action) => {
    switch (action.type) {
        case "INIT" : {
            return action.formData;
            //반환되는 값은 dispatch에 담겨있는 액션객체의 요소들을 반환하면됨
        }
        case CLIENTID:
            console.log("clientId", action.clientId);
            return { ...formData, clientId: action.payload };
        case ROLEID:
            return { ...formData, roleId: action.payload };
        case PASSWORD:
            return { ...formData, password: action.payload };
        case PASSWORD_CONFIRM:
            return { ...formData, passwordConfirm: action.payload };
        case CLIENTNAME:
            return { ...formData, clientName: action.payload };
        case TEL:
            return { ...formData, tel: action.payload };
        case ZIPCODE:
            return { ...formData, zipCode: action.payload };
        case ADDR:
            return { ...formData, addr: action.payload };
        case DETAILADDR:
            return { ...formData, detailAddr: action.payload };
        case PICTURE:
            return { ...formData, picture: action.payload };
        case JOINDATE:
            return { ...formData, joinDate: action.payload };
        case STATUS:
            return { ...formData, status: action.payload };
        case STAFFID:
            return { ...formData, staffId: action.payload };
        default:
            return formData;  // 기본 상태 반환
    }
}

// signUpDispatchContext form 전제 데이터 관리
export const signUpDispatchContext = createContext();

const SignUpComponent = () => {
    //getMapping data
    const [data, setData] = useState(null);
    //3. useReducer 호출: 리듀서와 formData 초기 상태를 전달 관리 ( reducer 함수, 초기값데이터 )
    const [formData,dispatch] = useReducer(reducer,"");

    useEffect(() => {
        // 페이지가 로드될 때 데이터 요청 (GET 요청)
        fetch("/api/signUp")
            .then((response) => {
                // 응답 상태가 정상인지 확인
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.text(); // JSON 형태로 변환
            })
            .then((data) => {
                // 데이터를 state에 저장
                setData(data);
                console.log("Response data:", data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });

    }, []); // 빈 의존성 배열 사용


    

    // value로 전달하는 객체는 자식 컴포넌트에서 사용할 수 있는 데이터들을 포함하는 객체
    //formData: 상태 객체로, 폼의 입력 값들을 저장
    //dispatch: 상태를 변경하는 함수입니다. 자식 컴포넌트에서 dispatch를 호출하여 액션을 보내면, 리듀서에서 상태를 업데이트
    //actionTypes: 액션 타입을 정의한 객체입니다. 이 객체는 상태를 변경할 때 액션 타입을 일관되게 사용할 수 있도록 도와줌
    return (
        <>

            <signUpDispatchContext.Provider value={{formData, dispatch}}>
                <div>
                    <span>{data}</span>
                    <SignUpInfo/>
                    <Btn text="회원가입" type="submit"/>
                </div>
            </signUpDispatchContext.Provider>

        </>
    )
}
export default SignUpComponent;