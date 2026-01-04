import React from "react";

// 수정컴포넌트에서는 defaultData
const RecomType=({defaultData,setDefaultData})=>{
//고정 옵션값
    const options = [
        { code: "NORMAL", title: "일반" },
        { code: "RECOMMEND", title: "추천" },
        { code: "POPULAR", title: "인기" }
    ];

    const recomTypeHandler=(e)=>{

        console.log("recomTypeHandler",e.target.value);
        console.log("recomTypeHandler",e.target.name);
        setDefaultData((prev)=>({
                ...prev,
                [e.target.name]: e.target.value
            }))
    }



    return (
        <>
                <strong className="form-title">등록분류</strong>
                <label htmlFor="recomType" className="visually-hidden form-title">등록분류</label>
                <select id="recomType"
                        className="form-select flex-fill w-50"
                        name="recomType"
                        value={defaultData?.recomType || options[0].code}
                        onChange={(e)=> recomTypeHandler(e)} >
                        {options?.map((option,index) => (
                            <option key={option.code} value={option.code}>
                                {option.title}
                            </option>
                        ))}
                </select>
        </>
    );
}

export default RecomType;