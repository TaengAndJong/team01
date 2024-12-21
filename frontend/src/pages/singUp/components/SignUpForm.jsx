import Btn from "../../../util/reuseBtn.jsx";
// import {checkDuplicate, isFormValid} from "../../../util/validation.jsx";
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
        identiNum : "",
        phone : "",
        email : "",
        dtailEmail : "",
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
        e.preventDefault(); //리랜더링 방지
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