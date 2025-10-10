import FormTag from "@util/formTag.jsx";
import {validID, validPW,checkDuplicate, validatePasswordMatch} from "@util/validation.jsx";
import React, {useEffect, useState} from "react";



const IdAndPw = ({clientId,password,clientName,setUserInfo})=>{
    console.log("clientId,password,clientName",clientId,password,clientName)
    //input onChange 핸들러
    const handleInputChange = (e) => {
        const { name, value } = e.target; // 입력 필드의 name과 value 가져오기
        setUserInfo({ ...formData, [name]: value });

    };



    return(
       <>
           {/*id*/}
           <div className="d-flex align-items-center mb-2 justify-content-start">
               <FormTag label="아이디" labelClass="form-title" className="form-control w-auto" name="clientId" type="text"
                        value={clientId}
                        readOnly
                        aria-readonly="true"/>
           </div>
           {/*pw*/}
           <div className="d-flex align-items-center mb-2">
               <label className="form-title">비밀번호</label>
               <input type="password" className="form-control w-auto" name="password" value={password}
                      readOnly
                      aria-readonly="true"/>
               <button type="button" className="btn custom-btn00 pw-change ms-1 py-2">변경</button>
           </div>
           <div className="d-flex align-items-center mb-2">
               <FormTag label="이름" labelClass="form-title" className="form-control w-auto" name="clientName"
                        value={clientName}
                        readOnly
                        aria-readonly="true"
               />
           </div>
       </>
    )

}

export default IdAndPw;