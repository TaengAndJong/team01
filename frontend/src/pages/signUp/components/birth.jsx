
import React, {useEffect, useState} from "react";

import {birthValidation} from "../../../util/validation/validationCommon.js";

const Birth = ({formData,setFormData}) =>{


    //개별 생년월일 상태관리 변수
    const [birth, setBirth] = useState({
        year: "",
        month: "",
        day: "",
    });

    const [msg,setMsg] = useState({});
    
    const handleBirthChangeHandler= (e) => {
        //입력되고 있는 이벤트 객체의 이름과, 값
        const name = e.target.name;
        const value = e.target.value;

        //핸들러에서 숫자만 입력할 수 있게 제어, 검증 x
        // 숫자만 허용 ==> 공통
        if (!/^\d*$/.test(value)) return { };
        // 년 입력값 필터
        if(name === "year"){
            // 4자리까지만 허용
            if (value.length > 4) return;
        }

        //월,일 입력 값  필터
        if(name === "month" || name === "day"){
            // 2자리까지만 허용
            if (value.length > 2) return;
        }


        // birthValidation(birth,name)의 문제점 해결방안
        //미리보기 객체 생성 --> birthvalid 의 birth는 아직 미갱신 상태라서 미리보기 객체에 담아서 검증에 반영해야 함
        const nextBirth = {
            ...birth, // 기존 year,month,day 유지
            [name]: value,// 현재 입력된 필드만 갱신
        }

        //생년월일 검증
       // 기존코드 const birthvalid = birthValidation(birth,name) --> birth 파라미터는 검증 후에 갱신되기때문에 검증 타이밍에 문제가 생김
        const birthvalid = birthValidation(nextBirth,name)
        console.log("birthValidation",birthvalid);
        //msg 갱신
        setMsg({
            type:birthvalid.type,
            valid:birthvalid.valid,
            message:birthvalid.message,
        })


        // 생년월일 상태값 갱신
        setBirth(nextBirth);
    }

    //birth 상태 변경 될 때마다 갱신
    useEffect(() => {
        // '년, 월 ,일 ' 모든 값이 있을 때만 infoDate의 'birth'를 갱신
        if (birth.year && birth.month  && birth.day) {
            // 'birthYear', 'birthMonth', 'birthDay' 값이 모두 있으면
            setFormData((prev) => ({
                ...prev,
                birth: `${birth.year}-${birth.month}-${birth.day}`,
            }));
        }

    }, [birth]);


    return(
        <>
            {/* 생년월일 */}
            <fieldset className="row mb-2">
                <legend className="form-title col-2">생년월일</legend>
                <div className="birth-info px-0 col-12 d-flex">
                    {/* 년 */}
                    <div className="col-2 px-0 d-inline-flex align-items-center">
                        <label htmlFor="birthYear" className="sr-only">
                            년
                        </label>
                        <input
                            type="text"
                            id="birthYear"
                            name="year"
                            className="form-control"
                            placeholder="YYYY"
                            maxLength={4}
                            value={birth.year}
                            onChange={handleBirthChangeHandler}
                        />
                        <span className="mx-2">년</span>
                    </div>
                    {/* 월 */}
                    <div className="col-2 px-0 d-inline-flex align-items-center">
                        <label htmlFor="birthMonth" className="sr-only">
                            월
                        </label>
                        <input
                            type="text"
                            id="birthMonth"
                            name="month"
                            className="form-control"
                            placeholder="MM"
                            maxLength={2}
                            value={birth.month}
                            onChange={handleBirthChangeHandler}
                        />
                        <span className="mx-2">월</span>
                    </div>
                    {/* 일 */}
                    <div className="col-2 px-0 d-inline-flex align-items-center">
                        <label htmlFor="birthDay" className="sr-only">
                            일
                        </label>
                        <input
                            type="text"
                            id="birthDay"
                            name="day"
                            className="form-control"
                            placeholder="DD"
                            maxLength={2}
                            value={birth.day}
                            onChange={handleBirthChangeHandler}
                        />
                        <span className="mx-2">일</span>
                    </div>
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

export default Birth;