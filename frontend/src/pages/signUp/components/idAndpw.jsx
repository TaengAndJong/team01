import FormTag from "@util/formTag.jsx";
import Btn from "@util/reuseBtn.jsx";
import {validID, validPW,checkDuplicate, validatePasswordMatch} from "@util/validation.jsx";
import {useEffect} from "react";


const IdAndPw = ({formData,setFormData,msg,setMsg,handleIdConfirm})=>{
        //부모한테서 formData와 inputChangeHandlerl, Msg , Error?

        console.log("아이디 패스워드 formData",formData)

  //  비밀번호 데이터가 변경될 때마다 갱신
    useEffect(() => {
        // 비밀번호 동일 여부 확인 , 바로 데이터를 파라미터로 넘겨주기
        const pwdConfirm = validatePasswordMatch(formData.password, formData.passwordConfirm);
        setMsg((prev) => ({
            ...prev,
            errorpwdConfirm: pwdConfirm.valid ? "" : pwdConfirm.message,
        }));

        // 비밀번호 유효성 검사
        const pwValidation = validPW(formData.password);
        setMsg((prev) => ({
            ...prev,
            errorpwd: pwValidation.valid ? "" : pwValidation.message,
        }));
    }, [formData.password, formData.passwordConfirm]);

//input onChange 핸들러
    const handleInputChange = (e) => {
        const { name, value } = e.target; // 입력 필드의 name과 value 가져오기
        setFormData({ ...formData, [name]: value });

        // 아이디 유효성 검사
        if (name === "clientId") {
            const idValidation = validID(value);
            setMsg((prev) => ({
                ...prev,
                errorId: idValidation.valid ? "" : idValidation.message,
            }));
        }

    };




    return(
       <>
           {/*id*/}
           <div className="d-flex align-items-center mb-2 justify-content-start">
               <FormTag label="아이디" labelClass="form-title" className="form-control w-75" name="clientId" type="text"
                        value={formData.clientId}
                        onChange={handleInputChange} msg={msg.errorId}/>
               <Btn className="btn-primary ms-1 w-25"  id="confirm" type="button" text="중복확인" onClick={() => {
                   handleIdConfirm("clientId", formData.clientId)
               }}/>
           </div>

           {/*pw*/}
           <div className="d-flex align-items-center mb-2">
               <FormTag label="비밀번호" labelClass="form-title" className="form-control" name="password" type="password"
                        value={formData.password}
                        onChange={handleInputChange} msg={msg.errorpwd}/>
           </div>
           <div className="d-flex align-items-center mb-2">
               <FormTag label="비밀번호확인" labelClass="form-title" className="form-control" name="passwordConfirm" type="password"
                        value={formData.passwordConfirm}
                        onChange={handleInputChange} msg={msg.errorpwdConfirm}/>
           </div>
           <div className="d-flex align-items-center mb-2">
               <FormTag label="이름" labelClass="form-title" className="form-control" name="clientName"
                        value={formData.clientName}
                        onChange={handleInputChange}/>
           </div>
       </>
    )

}

export default IdAndPw;