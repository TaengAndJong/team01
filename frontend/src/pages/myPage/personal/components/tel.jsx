import Select from "react-select";
import FormTag from "@util/form/formTag.jsx";
import React, {useEffect, useState} from "react";
import {eachTelValidation} from "@util/validation/validationCommon.js";


const Tel=({telNum,setUserInfo})=>{

    //
    const [msg,setMsg]=useState({});

    // telNum을 "-"을 기준으로 slice 해서 배열로 반환 

    //tel 에 FirstTelNum ,secondTelNum. lastTelNum으로 구분하기
    //전화번호 : handlerObject , e.target.name, e.target.value
    const [tel, setTel] = useState({}); // 빈값으로 두면 undefind로 출력되기때문에 태그요소 value 초기값 설정하기
    // 사용자 정보 조회해서 분리 및 초기값 설정
    useEffect(()=>{
       if(telNum){ //telNum 이 undefined 가 아닌경우
           const [first, second, last] = telNum.split("-"); // 배열로 구조분해

           //전화번호 초기값 분리 설정
           setTel({
               firstTelNum:first ||"",
               secondTelNum:second ||"",
               lastTelNum:last ||"",
           })
       }
    },[telNum])


    const handleTelChange=(e)=>{

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

            //전화번호 입력값 상태관리
            setTel(nextTel);

    }

    // tel 객체 갱신될 때마다 반영
    useEffect(()=>{
        // 전체 데이터 formData에 갱신하기
        if (tel.firstTelNum && tel.secondTelNum && tel.lastTelNum) {
            // FormInfoData의 tel 갱신
            setUserInfo((prev) => ({
                ...prev,
                tel: `${tel.firstTelNum}-${tel.secondTelNum}-${tel.lastTelNum}`
            }));
        }


    },[tel])


    return(
        <>
            {/*전화번호*/}
            <fieldset className="tel-info d-flex align-items-center mb-2 ">
                <legend className="form-title col-2">전화번호</legend>
                <div className="px-0  d-flex col-10">
                    <FormTag
                        className="form-control col-1 px-0 d-inline-flex text-center"
                        id="firstTelNum"
                        name="firstTelNum"
                        value={tel.firstTelNum || ""}
                        onChange={handleTelChange}
                        placeholder="첫 번째 전화번호 입력"
                    />
                    <span className="d-inline-flex align-items-center mx-2 seperator">-</span>
                    <FormTag
                        className="form-control col-1 px-0 d-inline-flex text-center"
                        id="secondTelNum"
                        name="secondTelNum"
                        value={tel.secondTelNum || ""}
                        onChange={handleTelChange}
                        placeholder="두 번째 전화번호 입력"
                    />
                    <span className="d-inline-flex align-items-center mx-2 seperator">-</span>
                    <FormTag
                        className="form-control col-1 px-0 d-inline-flex text-center"
                        id="lastTelNum"
                        name="lastTelNum"
                        value={tel.lastTelNum || ""}
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