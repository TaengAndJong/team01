import FormTag from "@util/form/formTag.jsx";
import Btn from "@util/form/reuseBtn.jsx";
import React, {useEffect, useState} from "react";


const IdAndPw = ({signInfo,setSignInfo,handleConfirm})=>{

    // 아이디와 비밀번호 값을 갱신 해줄 input onChange 핸들러
    const handleInputChange = (e) => {
        const { name, value } = e.target; // 입력 필드의 name과 value 가져오기
        setSignInfo({ ...signInfo, [name]: value });
    };

    return(
       <>
           {/*id*/}

               <div className="row col-12 mb-2">
                   <FormTag label="아이디" labelClass="form-title  col-2" id="clientId" className="form-control"  name="clientId" type="text"
                            value={signInfo.clientId}
                            onChange={handleInputChange}/>
                   <button className="btn custom-btn01 form-control w-auto ms-1 py-2"  id="confirm" type="button" onClick={() => {
                       handleConfirm("clientId", signInfo.clientId)
                   }}>중복확인</button>
               </div>

               {/*pw*/}
               <div className="row col-12  mb-2">
                   <FormTag label="비밀번호" labelClass="form-title col-2"  id="password" className="form-control" name="password" type="password"
                            value={signInfo.password}
                            onChange={handleInputChange}/>
               </div>
               <div className="row col-12  mb-2">
                   <FormTag label="비밀번호확인" labelClass="form-title col-2" className="form-control" name="passwordConfirm" type="password"
                            value={signInfo.passwordConfirm}
                            onChange={handleInputChange}/>
               </div>
               <div className="row col-12  mb-2">
                   <FormTag label="이름" labelClass="form-title col-2" className="form-control" name="clientName"
                            value={signInfo.clientName}
                            onChange={handleInputChange}/>
               </div>

       </>
    )

}

export default IdAndPw;