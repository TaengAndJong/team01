import SignUpForm from "./components/SignUpForm.jsx";
import {useEffect, useState} from "react";
const signUpComponent = () =>{

    const [data, setData] = useState(null);

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



    return(
        <>
            <div>
                <div><span>{data}</span></div>
                <SignUpForm/>
            </div>
        </>
    )
}
export default signUpComponent;