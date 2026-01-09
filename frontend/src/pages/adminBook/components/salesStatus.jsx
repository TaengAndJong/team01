import React from "react";


const SalesStatus = ({defaultData,setDefaultData}) =>{

    //고정 옵션값
    const options = [
        { code: "판매중", title: "판매중" },
        { code: "미판매", title: "미판매" },
        { code: "단종", title: "단종" }
    ];

    const saleStatusHandler=(e)=>{

        setDefaultData((prev)=>({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    return (
        <>
                <strong className="form-title">판매상태</strong>
                <label htmlFor="saleStatus" className="visually-hidden form-title col-3">판매상태</label>
                <select id="saleStatus" className="form-select  me-3 " name="saleStatus"
                        value={ defaultData.saleStatus|| options[0].code}
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