import {useState} from "react";
import {validPW, validatePasswordMatch} from "../../../util/validation.jsx";

const pwForm = () => {
    const [pw, setPw] = useState('');
    const [pwd, setPwd] = useState('');
    const [pwCheckMessage, setPwCheckMessage] = useState('대문자, 소문자, 특수문자, 숫자를 포함한 최소8자 이상');
    const [pwMatchMessage, setPwMatchMessage] = useState('비밀번호를 입력해주세요');

    const handlePwChange = async (e) => {
        const newPw = e.target.value;
        setPw(newPw);
        console.log("비밀번호",newPw);

        const validationResult = validPW(newPw);
        if(validationResult && validationResult.massage) {
            setPwCheckMessage(validationResult.massage);
        } else {
            setPwCheckMessage('대문자, 소문자, 특수문자, 숫자를 포함한 최소8자 이상');
        }
    }

    const handlePwMatch = (e) => {
        const newPwd = e.target.value;
        setPwd(newPwd);
        console.log("비밀번호 확인", newPwd);
        const validationPwMatchResult = validatePasswordMatch(pw, newPwd);
        if(validationPwMatchResult && validationPwMatchResult.message) {
            setPwMatchMessage(validationPwMatchResult.message);
        } else {
            setPwMatchMessage('비밀번호를 입력해주세요');
        }
    }
    return (
        <>
            <div>
                <label>비밀번호 </label>
                <input type="password" name="pw" placeholder="비밀번호를 입력해주세요" onChange={handlePwChange} value={pw}
                       maxLength={20}/>
                <p>{pwCheckMessage}</p>
            </div>

            <div>
                <label>비밀번호 확인</label>
                <input type="password" name="pwd" placeholder="비밀번호를 입력해주세요" onChange={handlePwMatch} value={pwd}
                       maxLength={20}/>
                <p>{pwMatchMessage}</p>
            </div>

        </>
    )
}

export default pwForm;