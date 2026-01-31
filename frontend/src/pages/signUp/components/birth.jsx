import Select from "react-select";
import React, {useEffect, useState} from "react";
import {generateOptions} from "@util/form/selectDate.jsx";
import {birthValidation, numberValidation} from "../../../util/validation/validationCommon.js";

const Birth = ({formData,setFormData}) =>{


    //개별 생년월일 상태관리 변수
    const [birth, setBirth] = useState({
        year: "",
        month: "",
        day: "",
    });

    const [msg,setMsg] = useState({});
    
    const handleBirthChangeHandler= (e) => {

        const name = e.target.name;
        const value = e.target.value;

        //생년월일 검증
        console.log("birth",birth);
        console.log("birthValidation",birthValidation(birth));
        const birthvalid = birthValidation(birth,name)
        //msg 갱신
        setMsg({
            type:birthvalid.type,
            valid:birthvalid.valid,
            message:birthvalid.message,
        })
        // 생년월일 상태값 갱신
        setBirth((prev)=>({...prev, [name]:value}));
    }

    //birth 상태 변경 될 때마다 갱신
    useEffect(() => {
        // '년, 월 ,일 ' 모든 값이 있을 때만 infoDate의 'birth'를 갱신
        if (birth.birthYear && birth.birthMonth && birth.birthDay) {
            // 'birthYear', 'birthMonth', 'birthDay' 값이 모두 있으면
            setFormData((prev) => ({
                ...prev,
                birth: `${birth.birthYear}-${birth.birthMonth}-${birth.birthDay}`,
            }));
        }

    }, [birth]);


    return(
        <>
            {/* 생년월일 */}
            <div className="mb-2 birth">
                <div className="row col-12 mb-2 flex-nowrap birth-info">
                    <label className="form-title col-2">생년월일</label>
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
                {msg.message && !msg.allowEmpty && (
                    <div className="d-flex align-items-center my-2" role="alert">
                        <span className="col-2"></span>
                        {msg.type === "common" && (<><i className="icon info me-2"></i>{msg.message}</>)}
                        {msg.type === "year" && (<><i className="icon info me-2"></i>{msg.message}</>)}
                        {msg.type === "month" && (<><i className="icon info me-2"></i>{msg.message}</>)}
                        {msg.type === "day" && (<><i className="icon info me-2"></i>{msg.message}</>)}
                    </div>
                    )}
            </div>

                    </>
                    )
                }

export default Birth;