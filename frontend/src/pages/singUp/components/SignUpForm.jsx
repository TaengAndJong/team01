import Btn from "../../../util/reuseBtn.jsx";
import {FormValid} from "../../../util/validation.jsx";
import {useState} from "react";
// import forms
import IdPwForm from "./idPwForm.jsx";
import InfoForm from "./infoForm.jsx"

const SignUpForm = ()=> { //
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


    const handleSubmit = (e) => {
        e.preventDefault(); // 새로고침 방지

        if(!FormValid(formData)){
            alert("필수 정보를 입력해주세요")
            return;
        }


        // 서버로 전송하는 로직

        console.log("회원가입 데이터:", formData);

    };

    return (
        <>
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