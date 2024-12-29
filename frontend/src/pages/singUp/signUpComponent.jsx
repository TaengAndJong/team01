
import {createContext, useEffect, useState} from "react";
import Btn from "../../util/reuseBtn.jsx";
import SignUpInfo from "./components/signUpInfo.jsx";


//컴포넌트 범위 밖에 선언하기
const signUpContext = createContext();

const SignUpComponent = () => {


    const [data, setData] = useState(null);

    //form data
    const [formData, setFormData] = useState({
        clientId : "",//아이디
        roleId : "",//
        password : "",//비밀번호
        passwordConfirm : "",//비밀번화확인 (디비로 안넘어감)
        clientName :"",// user이름
        tel : "",//전화번호
        zipCode : "",//우편번호
        addr : "",// 기본주소
        detailAddr : "",// 상세주소
        picture:"", // 기본이미지 또는 다른 이미지
        joinDate:"", // 가입일
        status:"", // "일반회원","사원"  // --> 일반회원일 경우 ROLE_CLIENT, 사원일 경우 ROLE_ADMIN , 관리자일 경우 ROLE_ADMIN
        staffId:"",// 사원번호
    })


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





    const handleInputChange = (name, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        console.log(`${name} : `,value);
    };


    return (
        <>
            <signUpContext.Provider value={{formData, handleInputChange}}>
                <div>
                    <span>{data}</span>
                    <SignUpInfo />
                    <Btn text="회원가입" type="submit" />
                </div>
            </signUpContext.Provider>
        </>
    )
}
export default SignUpComponent;