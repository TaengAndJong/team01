import Select from "react-select";
import FormTag from "../../../util/formTag.jsx";
import React, {useEffect, useState} from "react";
import {validEachTel} from "../../../util/validation.jsx";


const Tel=({formData,setFormData,msg,setMsg})=>{

    //전화번호 : handlerObject , e.target.name, e.target.value
    const [tel, setTel] = useState({}); // 빈값으로 두면 undefind로 출력되기때문에 태그요소 value 초기값 설정하기
    const handleTelChange = (eventTarget,name)=>{
        // Select 컴포넌트의 onChange
        if (name) { // 파라미터에 name값이 넘어올 경우
            setTel((prevState) => ({
                ...prevState,
                [name]: eventTarget.value,
            }));
        } else {
            // FormTag 컴포넌트의 onChange
            const { name, value } = eventTarget.target;

            // 전화번호 업데이팅 되기전 두 or 세번째 데이터  검증 후 업데이팅
            if(name === "secondTelNum" || name === "lastTelNum"){

                //true ,false 반환
                const eachTelNumVailid = validEachTel(name,value);
                //한번만 갱신하면됨
                setMsg((prev) => ({
                    ...prev,
                    errorTel: eachTelNumVailid.valid ? "" : eachTelNumVailid.message, // true , false 에 따라 출력
                }));

            }
            //전화번호 입력값 상태관리
            setTel((prevState) => ({
                ...prevState,
                [name]: value,
            }));
            //
        }

        return tel;
    }

    // tel 객체 갱신될 때마다 반영
    useEffect(()=>{
        // 전체 데이터 formData에 갱신하기
        if (tel.FirstTelNum && tel.secondTelNum && tel.lastTelNum) {
            // FormInfoData의 tel 갱신
            setFormData((prev) => ({
                ...prev,
                tel: `${tel.FirstTelNum}-${tel.secondTelNum}-${tel.lastTelNum}`
            }));
        }
    },[tel])


    return(
        <>
            {/*전화번호*/}
            <div className="d-flex align-items-center mb-2">
                <label className="form-title">전화번호</label>
                <Select
                    className="w-25"
                    name="FirstTelNum"
                    id="FirstTelNum"
                    onChange={(selectedOption) => {

                        handleTelChange({target: {name: "FirstTelNum", value: selectedOption.value}});
                    }}
                    options={[
                        {value: '직접선택', label: '직접선택'},
                        {value: '010', label: '010'},
                    ]}
                />
                <span className="d-inline-block mx-2">-</span>
                <FormTag
                    className="form-control w-25"
                    name="secondTelNum"
                    value={tel.secondTelNum || ""}
                    onChange={handleTelChange}
                    placeholder="두 번째 전화번호 입력"
                />
                <span className="d-inline-block mx-2">-</span>
                <FormTag
                    className="form-control w-25"
                    name="lastTelNum"
                    value={tel.lastTelNum || ""}
                    onChange={handleTelChange}
                    placeholder="마지막 전화번호 입력"
                />
                {msg.errorTel && (
                    <span>{msg.errorTel}</span>
                )}
            </div>
        </>

    )

}

export default Tel;