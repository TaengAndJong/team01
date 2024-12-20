import Btn from "../../../util/reuseBtn.jsx";
import {validateInput} from "../../../util/validation.jsx";
import {useState} from "react";

const SignUpForm = ()=> { //
    const [values,SetValues] = useState({
        id : "",
        pw : "",
    });

    const duplicationHandle = () => {
        validateInput()
    }
    return (
        <>
            <div>
                <span>회원가입 입력 폼</span>
            </div>
            <div>
                <p>아이디</p>
                <input type="text" name="id"/>
                <Btn text="중복확인" type="" onClick={() => {
                    duplicationHandle(id, id)
                }} className="btn-id_duplication"/>
            </div>
            <div>
                <p>비밀번호</p>
                <input type="text" name="id"/>
            </div>
            <div>
                <p>비밀번호</p>
                <input type="text" name="id"/>
            </div>
            <div>
                <p>E-mail</p>
                <input type="text" name="id"/>
            </div>
            <div>
                <p>비밀번호</p>
                <input type="text" name="id"/>
            </div>
            <div>
                <Btn text="회원가입" type="submit" onClick={() => {
                }} className="btn-signUp"/>
            </div>

        </>
    )
}

export default SignUpForm;