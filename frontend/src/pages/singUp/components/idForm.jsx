import Btn from "../../../util/reuseBtn.jsx";
import {checkDuplicate, validID} from "../../../util/validation.jsx";
import {useState} from "react";

const idForm = () => {
    const [id, setId] = useState('');
    const [idCheckMessage, setIdCheckMessage] = useState('대소문자, 숫자를 포함한 3~20자 이내');
    const handleIdChange = (e) => {
        const newId = e.target.value;
        setId(newId);
        console.log("아이디",newId);

        const validationResult = validID(newId);
        if(validationResult && validationResult.massage) {
            setIdCheckMessage(validationResult.massage);
        } else {
            setIdCheckMessage('대소문자, 숫자를 포함한 ~20자 이내');
        }
    }
    return(
        <>
            <div>
                <label>아이디 </label>
                <input type="text" name="id" placeholder="아이디를 입력해주세요" onChange={handleIdChange} value={id}
                       maxLength={20}/>
                <Btn text="중복확인" type="" onClick={() => {
                    alert(checkDuplicate(id).massage);
                }}/>
                <p>{idCheckMessage}</p>
            </div>
        </>
    )
}

export default idForm;