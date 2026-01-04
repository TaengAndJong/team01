import React from "react";

// 수정컴포넌트에서는 defaultData
const RecomType=({defaultData,setDefaultData})=>{
//고정 옵션값
    const options = [
        { code: "NORMAL", title: "일반" },
        { code: "RECOMMEND", title: "추천" },
        { code: "POPULAR", title: "인기" }
    ];

    const recomeTypeHandler=(e)=>{

        console.log("recomeTypeHandler",e.target.value);
        console.log("recomeTypeHandler",e.target.name);
        setDefaultData((prev)=>({
                ...prev,
                [e.target.name]: e.target.value
            }))
    }



    return (
        <>
                <strong className="form-title">등록분류</strong>
                <label htmlFor="recomeType" className="visually-hidden form-title">등록분류</label>
                <select id="recomeType"
                        className="form-select flex-fill w-50"
                        name="recomeType"
                        value={defaultData?.recomeType || options[0].code}
                        onChange={(e)=> recomeTypeHandler(e)} >
                        {options?.map((option,index) => (
                            <option key={option.code} value={option.code}>
                                {option.title}
                            </option>
                        ))}
                </select>
        </>
    );
}

export default RecomeType;