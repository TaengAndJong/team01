// import Btn from "../../../util/reuseBtn.jsx";
// import {checkDuplicate, isFormValid} from "../../../util/validation.jsx";
import {useState} from "react";
// import forms
import IDform from "./idForm.jsx";

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



    const handleSubmit =async (e)=> {
        e.preventDefault(); // 리렌더링 방지

    }


    return (
        <>
            <form onSubmit={handleSubmit}>
                <h2>회원가입</h2>
            <IDform />
            </form>
        </>
    )
}

export default SignUpForm;