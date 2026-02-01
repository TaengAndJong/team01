
import FormTag from "@util/form/formTag.jsx";
import React, {useEffect, useState} from "react";
import {eachTelValidation} from "@util/validation/validationCommon.js";



const Tel=({formData,setFormData})=>{

    //전화번호 : handlerObject , e.target.name, e.target.value
    const [tel, setTel] = useState({}); // 빈값으로 두면 undefind로 출력되기때문에 태그요소 value 초기값 설정하기
    const [msg,setMsg] = useState({});
    
    //전화번호 입력 핸들러
    const handleTelChange = (e)=>{
        // FormTag 컴포넌트의 onChange
        const { name, value } = e.target;

        //상태값 갱신 순서를 맞추기위해 미리보기 객체 ==> 입력으로 들어온 최신 값 객체에 담아주기
        const nextTel = {
            ...tel,
            [name]:value
        }

        console.log("nextTel",nextTel);
        // 최신값으로 전화번호 검증
        const telNumVailid = eachTelValidation(nextTel,name);
        console.log("eachTelNumVailid", telNumVailid);
        //msg에 검증에서 반환된 값 담기
        setMsg(
        {type:telNumVailid.type,
            valid:telNumVailid.valid,
            message:telNumVailid.message,}
        )
        
        //통과되면 미리보기 객체의 값 담기
        setTel(nextTel);
    }

    // tel 객체 갱신될 때마다 반영
    useEffect(()=>{
        console.log("tel", tel);
        //tel의 첫 번째,두 번째,세 번째 값이 다 존재할 경우, formDate에 담아주기
        
    },[tel])


    return(
        <>
            {/*전화번호*/}
            <fieldset className="row col-12 mb-2 tel-info">
                <legend className="form-title col-2">전화번호</legend>
                <div className="px-0 col-12 d-flex">
                    <FormTag
                        className="form-control col-1 px-0 d-inline-flex text-center"
                        id="firstTelNum"
                        name="firstTelNum"
                        value={tel.firstTelNum || ""}
                        onChange={handleTelChange}
                        placeholder="첫 번째 전화번호 입력"
                    />
                    <span className="d-inline-flex align-items-center mx-2">-</span>
                    <FormTag
                        className="form-control col-1 px-0 d-inline-flex text-center"
                        id="secondTelNum"
                        name="secondTelNum"
                        value={tel.secondTelNum || ""}
                        onChange={handleTelChange}
                        placeholder="두 번째 전화번호 입력"
                    />
                    <span className="d-inline-flex align-items-center mx-2">-</span>
                    <FormTag
                        className="form-control col-1 px-0 d-inline-flex text-center"
                        id="thirdTelNum"
                        name="thirdTelNum"
                        value={tel.thirdTelNum || ""}
                        onChange={handleTelChange}
                        placeholder="마지막 전화번호 입력"
                    />

                </div>
                {msg.message && (
                    <div className="d-flex align-items-center my-2" role="alert">
                        <i className="icon info me-2"></i>{msg.message}
                    </div>
                )}
            </fieldset>
        </>

    )

}

export default Tel;