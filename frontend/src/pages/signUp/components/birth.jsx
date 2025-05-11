import Select from "react-select";
import React, {useEffect, useState} from "react";
import {generateOptions} from "@util/selectDate.jsx";

const Birth = ({formData,setFormData,msg,setMsg}) =>{

    //birth handler
    //react-select Api에서 생년월일 가져오기
    const yearOptions = generateOptions(1920, 2030, "년"); // 1990년부터 2024년까지
    const monthOptions = generateOptions(1, 12, "월", true); // 1월부터 12월까지 (0 패딩)
    const dayOptions = generateOptions(1, 31, "일", true); // 1일부터 31일까지 (0 패딩)

    const [birth, setBirth] = useState({})
    const handleBirthChange= (selectedOption,name) => {

        // 2. 기존 값을 불러와서 키-값 형태로 설정 (객체에 key : value  추가) , name에 따른 vale에 2자리 중 빈자리 0 추가
        if (name === 'birthMonth' || name === 'birthDay') {
            //  name에 따른 value에 2자리 중 빈자리 0 추가
            const value = String(selectedOption.value).padStart(2, "0");

            setBirth((prevState) => ({
                ...prevState,
                [name]: value, // 이전 상태를 유지하면서 name에 해당하는 값만 업데이트
            }));

            console.log("birth=------",birth)
        } else {
            // birthYear인 경우 그냥 추가
            setBirth((prevState) => ({
                ...prevState,
                [name]: selectedOption.value,
            }));

            console.log("birth=------",birth)
        }

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
            <div className="mb-2">
                <div className="Info birth d-flex align-items-center mb-1 w-100">
                    <label className="form-title">생년월일</label>
                    <Select
                        name="birthYear"
                        id="birthYear"
                        className="me-1"
                        options={yearOptions}
                        onChange={(selectedOption) => handleBirthChange(selectedOption, "birthYear")}
                        placeholder="연도 선택"
                    />

                    <Select
                        name="birthMonth"
                        id="birthMonth"
                        className="me-1"
                        options={monthOptions}
                        onChange={(selectedOption) => handleBirthChange(selectedOption, "birthMonth")}
                        placeholder="월 선택"
                    />

                    <Select
                        name="birthDay"
                        id="birthDay"
                        className="me-1"
                        options={dayOptions}
                        onChange={(selectedOption) => handleBirthChange(selectedOption, "birthDay")}
                        placeholder="일 선택"
                    />

                </div>
            </div>

        </>
    )
}

export default Birth;