import FormTag from "@util/form/formTag.jsx";
import {idvalidation, pwConfirmValidation, pwvalidation} from "@util/validation/validationCommon.js";
import React, {useState} from "react";
import axios from "axios";
import {catchError} from "@util/error/error.jsx";
import {useModal} from "@common/modal/ModalContext.jsx";


const IdAndPw = ({formData,setFormData})=>{

    //공통모달
    const {openModal,closeModal} = useModal();
    //메시지 상태관리
    const [msg, setMsg] = useState({});
    // 아이디와 비밀번호 값을 갱신 해줄 input onChange 핸들러
    const handleInputChange = (e) => {
        const { name, value } = e.target; // 입력 필드의 name과 value 가져오기
        //아이디 형식 검증
        if (name === "clientId") {
            console.log("name",name);
            const idValid = idvalidation(value);
            console.log("아이디 검증",idValid);
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
            console.log("비밀번호 검증",pwValid);
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
            console.log("비밀번호 재검증",pwConfirmValid);
            setMsg({
                type:name,
                valid: pwConfirmValid.valid,
                message: pwConfirmValid.message,
            })

        }

        setFormData({ ...formData, [name]: value });
    };

    //서버로 아이디 검증 요청 ==> 아이디만 검증 요청하는 코드로 수정해야함
    const handleConfirmId = async () => {
        console.log("clientId", formData?.clientId);
        try{
            //axios 를 사용하는 이유 : params를 사용해 값들을 쿼리스트링으로 자동 변환하여 URLSearchParams 사요할 필요 없음
            const response = await axios.post("/api/signup/idConfirm",{clientId: formData?.clientId});
            console.log("아이디 검증요청 응답 ",response)
            // 성공했을 경우 모달
            const type = response.data.type;

            //
            switch(type) {
                case "CLIENTID": openModal({
                    modalType: "default",
                    content:<p>사용 가능한 아이디입니다.</p>,
                    onConfirm: () => {closeModal()},
                });
                    break;
            }

        }catch(err){
            console.log("회원가입 에러",err);
            //에러처리
            catchError(err, { openModal, closeModal});
        }
        //end
    }

    return(
       <>
           {/*id*/}

               <div className="row col-12 mb-2">
                   <FormTag label="아이디" labelClass="form-title col-2" id="clientId" className="form-control"  name="clientId" type="text"
                            value={formData.clientId}
                            onChange={handleInputChange}  placeholder={"아이디"}/>
                   <button className="btn custom-btn01 form-control w-auto ms-1 py-2"  id="confirm" type="button" onClick={handleConfirmId}>중복확인</button>

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
                            onChange={handleInputChange}
                            placeholder={"비밀번호"}/>
                   {msg.message && msg.type === "password" && (
                       <div className="d-flex align-items-center my-2">
                           <i className="icon info me-2"></i>{msg.message}
                       </div>
                   )}
               </div>
               <div className="row col-12  mb-2">
                   <FormTag label="비밀번호확인" labelClass="form-title col-2" className="form-control" name="passwordConfirm" type="password"
                            value={formData.passwordConfirm}
                            onChange={handleInputChange}
                            placeholder={"비밀번호 확인"}
                   />
               
                   {msg.message && msg.type === "passwordConfirm" && (
                       <div className="d-flex align-items-center my-2"  role="alert">
                           <i className="icon info me-2"></i>{msg.message}
                       </div>
                   )}
               </div>
               <div className="row col-12  mb-2">
                   <FormTag label="이름" labelClass="form-title col-2" className="form-control" id="clientName" name="clientName"
                            value={formData.clientName}
                            onChange={handleInputChange}
                            placeholder={"이름"}/>
               </div>

       </>
    )
}

export default IdAndPw;