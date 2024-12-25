import Btn from "../../../util/reuseBtn.jsx";
import {checkDuplicate, validatePasswordMatch, validID, validPW} from "../../../util/validation.jsx";
import {useState} from "react";

const idPwForm = ({ formData, onInputChange }) => {
    // id useState
    const [idCheckMessage, setIdCheckMessage] = useState('대소문자, 숫자를 포함한 3~20자 이내');

    // pw useState
    const [pwCheckMessage, setPwCheckMessage] = useState('대문자, 소문자, 특수문자, 숫자를 포함한 최소8자 이상');
    const [pwMatchMessage, setPwMatchMessage] = useState('비밀번호를 입력해주세요');

    // id handler
    const handleIdChange = (e) => {
        const newId = e.target.value;
        onInputChange("id", newId);  // 부모로 상태 전달

        const validationResult = validID(newId);
        if(validationResult && validationResult.massage) {
            setIdCheckMessage(validationResult.massage);
        } else {
            setIdCheckMessage('대소문자, 숫자를 포함한 ~20자 이내');
        }
    }

    // pw handler
    const handlePwChange = async (e) => {
        const newPw = e.target.value;
        onInputChange("pw", newPw);  // 부모로 상태 전달

        const validationResult = validPW(newPw);
        if(validationResult && validationResult.massage) {
            setPwCheckMessage(validationResult.massage);
        } else {
            setPwCheckMessage('대문자, 소문자, 특수문자, 숫자를 포함한 최소8자 이상');
        }
    }

    const handlePwMatch = (e) => {
        const newPwd = e.target.value;
        onInputChange("pwd", newPwd);  // 부모로 상태 전달

        const validationPwMatchResult = validatePasswordMatch(formData.pw, newPwd);
        if(validationPwMatchResult && validationPwMatchResult.message) {
            setPwMatchMessage(validationPwMatchResult.message);
        } else {
            setPwMatchMessage('비밀번호를 입력해주세요');
        }
    }

    return(
        <>
            <div>
                <label>아이디 </label>
                <input type="text" name="id" placeholder="아이디를 입력해주세요" onChange={handleIdChange} value={formData.id}
                       maxLength={20}/>
                <Btn text="중복확인" type="" onClick={() => {
                    alert(checkDuplicate(id).massage);
                }}/>
                <p>{idCheckMessage}</p>
            </div>
            <div>
                <label>비밀번호 </label>
                <input type="password" name="pw" placeholder="비밀번호를 입력해주세요" onChange={handlePwChange} value={formData.pw}
                       maxLength={20}/>
                <p>{pwCheckMessage}</p>
            </div>
            <div>
                <label>비밀번호 확인 </label>
                <input type="password" name="pwd" placeholder="비밀번호를 입력해주세요" onChange={handlePwMatch} value={formData.pwd}
                       maxLength={20}/>
                <p>{pwMatchMessage}</p>
            </div>
        </>
    )
}

export default idPwForm;