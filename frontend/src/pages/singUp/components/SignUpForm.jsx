import Btn from "../../../util/reuseBtn.jsx";
import {FormValid} from "../../../util/validation.jsx";
import {useState} from "react";
// import forms
import IdPwForm from "./idPwForm.jsx";
import InfoForm from "./infoForm.jsx"

const SignUpForm = ({data})=> { //

    console.log("data",data);

    const [formData, setFormData] = useState({
        id : "",
        pw : "",
        pwd : "",
        name :"",
        f_IdentiNum : "",
        s_IdentiNum : "",
        phone : "",
        email : "",
        adr : "",
        dtailAdr : "",
    })

    const handleInputChange = (name, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        console.log(`${name} : `,value);
    };


    const handleSubmit = async (e) => {
        e.preventDefault(); //리랜더링 방지

        const userCredentials = {
            formData // or { formData: formData } ==>직접 참조
        };

        if(!FormValid(formData)){
            alert("필수 정보를 입력해주세요")
            return;
        }

        // 서버로 데이터 전송하는 로직
        const response = await fetch("/api/login",{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userCredentials),
        });

        console.log("userCredentials",userCredentials);
        console.log("formData",userCredentials.formData);
        console.log("response",response);

        const contentType = response.headers.get("Content-Type");
        let data='';
        
        if(response.ok){
            console.log("contentType",contentType);
            console.log("응답 성공",data.message);

            if (contentType && contentType.includes("application/json")) {
                data = await response.json();
                console.log("제이슨",data.message);
                // JSON 응답일 경우
                return data;
            } else {
                console.log("error response",response);
                data = response.text();// 텍스트 응답일 경우
                console.log("텍스트",data.message);
                return data;
            }

        }else{
            console.log("전송 실패",data.message);
        }


    };

    return (
        <>
            <h6>{data}</h6>
            <form onSubmit={handleSubmit}>
                <h2>회원가입</h2>
                <IdPwForm
                    formData={formData}
                    onInputChange={handleInputChange}
                />
                <InfoForm
                    formData={formData}
                    onInputChange={handleInputChange}
                />
                <Btn text="회원가입" type="submit" onClick={handleSubmit} />
            </form>
        </>
    )
}

export default SignUpForm;