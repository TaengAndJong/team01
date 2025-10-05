import Select from "react-select";
import FormTag from "@util/formTag.jsx";
import React, {useEffect, useState} from "react";
import {validEachTel} from "@util/validation.jsx";


const Tel=({telNum,setFormData,msg,setMsg})=>{

    console.log("telNum-----------",telNum);
    // telNum을 "-"을 기준으로 slice 해서 배열로 반환 

    //tel 에 FirstTelNum ,secondTelNum. lastTelNum으로 구분하기
    //전화번호 : handlerObject , e.target.name, e.target.value
    const [tel, setTel] = useState({}); // 빈값으로 두면 undefind로 출력되기때문에 태그요소 value 초기값 설정하기
    // 사용자 정보 조회해서 분리 및 초기값 설정
    useEffect(()=>{
       if(telNum){ //telNum 이 undefined 가 아닌경우
           const telArray = telNum?.split("-");
           console.log("telArray------",telArray);
           //전화번호 초기값 분리 설정
           setTel({
               firstTelNum:telArray[0],
               secondTelNum:telArray[1],
               lastTelNum:telArray[2],
           })
       }
    },[telNum])


    const handleTelChange=(eventTarget,name)=>{
        // Select 컴포넌트의 onChange
        if (name) { // 파라미터에 name값이 넘어올 경우
            setTel((prevState) => ({
                ...prevState,
                [name]: eventTarget.value,
            }));
        } else {
            // FormTag 컴포넌트의 onChange
            const { name, value } = eventTarget.target;
            console.log("Input change: ", name, value);

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
                    isDisabled={true}
                    value={{ value: tel.firstTelNum, label: tel.firstTelNum }}
                    onChange={(selectedOption) => {
                        console.log("selectedOption", selectedOption);
                        handleTelChange({target: {name: "FirstTelNum", value: selectedOption.value}});
                    }}
                    options={[
                        {value: '010', label: '010'},
                    ]}
                />
                <span className="d-inline-block mx-2">-</span>
                <FormTag
                    className="form-control w-25"
                    name="secondTelNum"
                    value={tel.secondTelNum}
                    onChange={handleTelChange}
                    placeholder="두 번째 전화번호 입력"
                />
                <span className="d-inline-block mx-2">-</span>
                <FormTag
                    className="form-control w-25"
                    name="lastTelNum"
                    value={tel.lastTelNum}
                    onChange={handleTelChange}
                    placeholder="마지막 전화번호 입력"
                />
                {/*{msg.errorTel && (*/}
                {/*    <span>{msg.errorTel}</span>*/}
                {/*)}*/}
            </div>
        </>

    )

}

export default Tel;