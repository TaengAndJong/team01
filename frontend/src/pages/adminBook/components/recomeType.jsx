import React from "react";


const RecomType=({setCreatebook})=>{
//고정 옵션값
    const options = [
        { code: "NORMAL", title: "일반" },
        { code: "RECOMMEND", title: "추천" },
        { code: "POPULAR", title: "인기" }
    ];

    const recomTypeHandler=(e)=>{
        console.log("변경되고있다");
        console.log("event.target",e.target.value);
        console.log("event.target",e.target.name);
        setCreatebook((prev)=>({
                ...prev,
                [e.target.name]: e.target.value
            }))
    }


    return (
        <>
            <div className="d-flex align-items-center mb-1">
                <strong className="form-title">등록분류</strong>
                <label htmlFor="recomType" className="visually-hidden form-title">등록분류</label>
                <select id="recomType" className="form-select w-auto" name="recomType" onChange={(e)=>recomTypeHandler(e)} >
                    {options?.map((option,index) => (
                        <option key={option.code} value={option.code}>
                            {option.title}
                        </option>
                    ))}
                </select>
           
            </div>
        </>
    );
}

export default RecomType;