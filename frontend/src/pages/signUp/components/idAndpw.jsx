import FormTag from "@util/form/formTag.jsx";
import {idvalidation, pwConfirmValidation, pwvalidation} from "../../../util/validation/validationCommon.js";
import {useState} from "react";


const IdAndPw = ({formData,setFormData,handleConfirm})=>{

    //메시지 상태관리
    const [msg, setMsg] = useState({});
    // 아이디와 비밀번호 값을 갱신 해줄 input onChange 핸들러
    const handleInputChange = (e) => {
        const { name, value } = e.target; // 입력 필드의 name과 value 가져오기
        //아이디 형식 검증
        if (name === "clientId") {
            console.log("name",name);
            const idValid = idvalidation(value);
            console.log("idValidation",idValidation);
            setMsg({
                type: name,
                valid: idValid.valid,
                message: idValid.message,
            });
        }
        //비밀번호 형식 검증
        if(name === "password"){
            console.log("name",name);
            const pwValid = pwvalidation(value);
            console.log("pwvalidation",pwValidation);
            setMsg({
                type: name,
                valid: pwValid.valid,
                message: pwValid.message,
            });
        }

        // 비밀번호 확인 검증
        if(name === "passwordConfirm"){
            console.log("name",name);
            const pwConfirmValid = pwConfirmValidation(formData.password,value)
            console.log("pwConfirmValid",pwConfirmValid);
            setMsg({
                type:name,
                valid: pwConfirmValid.valid,
                message: pwConfirmValid.message,
            })

        }

        setFormData({ ...formData, [name]: value });
    };


    return(
       <>
           {/*id*/}

               <div className="row col-12 mb-2">
                   <FormTag label="아이디" labelClass="form-title col-2" id="clientId" className="form-control"  name="clientId" type="text"
                            value={formData.clientId}
                            onChange={handleInputChange}/>
                   <button className="btn custom-btn01 form-control w-auto ms-1 py-2"  id="confirm" type="button" onClick={() => {
                       handleConfirm("clientId", formData.clientId)
                   }}>중복확인</button>

               </div>
               {/* 검증 메시지가 있을 때만 출력*/}
               {msg.message && msg.type === "clientId" && (
                   <div className="d-flex align-items-center my-2" role="alert">
                       <span className="col-2"></span>
                       <i className="icon info me-2"></i>{msg.message}</div>
               )}
               {/*pw*/}
               <div className="row col-12  mb-2">
                   <FormTag label="비밀번호" labelClass="form-title col-2"  id="password" className="form-control" name="password" type="password"
                            value={formData.password}
                            onChange={handleInputChange}/>
                   {msg.message && msg.type === "password" && (
                       <div className="d-flex align-items-center my-2">
                           <i className="icon info me-2"></i>{msg.message}
                       </div>
                   )}
               </div>
               <div className="row col-12  mb-2">
                   <FormTag label="비밀번호확인" labelClass="form-title col-2" className="form-control" name="passwordConfirm" type="password"
                            value={formData.passwordConfirm}
                            onChange={handleInputChange}/>
                   {msg.message && msg.type === "passwordConfirm" && (
                       <div className="d-flex align-items-center my-2"  role="alert">
                           <i className="icon info me-2"></i>{msg.message}
                       </div>
                   )}
               </div>
               <div className="row col-12  mb-2">
                   <FormTag label="이름" labelClass="form-title col-2" className="form-control" id="clientName" name="clientName"
                            value={formData.clientName}
                            onChange={handleInputChange}/>
               </div>

       </>
    )
}

export default IdAndPw;