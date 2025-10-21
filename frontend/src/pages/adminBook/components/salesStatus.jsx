import React from "react";


const SalesStatus = ({defaultData,setDefaultData}) =>{

    //고정 옵션값
    const options = [
        { code: "판매중", title: "판매중" },
        { code: "미판매", title: "미판매" },
        { code: "단종", title: "단종" }
    ];

    const saleStatusHandler=(e)=>{
        console.log("판매상태 변경되고있다");
        console.log("event.target",e.target.value);
        console.log("event.target",e.target.name);
        setDefaultData((prev)=>({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    console.log("SalesStatus ---- defaultData.recomType", defaultData?.recomType);
    return (
        <>
                <strong className="form-title">판매상태</strong>
                <label htmlFor="saleStatus" className="visually-hidden form-title">판매상태</label>
                <select id="saleStatus" className="form-select flex-fill me-3" name="saleStatus" value={defaultData?.saleStatus}
                        onChange={(e) => saleStatusHandler(e)}>
                    {options?.map((option, index) => (
                        <option key={option.code} value={option.code}>
                            {option.title}
                        </option>
                    ))}
                </select>
        </>
    )
}

export default SalesStatus;