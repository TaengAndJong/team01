

import React from "react";
import FormTag from "@util/formTag.jsx";
import DaumPostcode from "@util/daumPostcode.jsx";

const Address=({userInfo,setUserInfo,msg,setMsg})=>{


    //input onChange 핸들러
    const handleInputChange = (e) => {
        const { name, value } = e.target; // 입력 필드의 name과 value 가져오기

        setUserInfo(prev => ({
            ...prev,       // 기존 userInfo 전체 유지
            [name]: value  // 변경된 주소 필드만 업데이트
        }));

    };

    //주소
    const handleAddressSelect = (addressObject) => {

        // 다음 API에서 받은 데이터 infoData에 갱신해주기
        setUserInfo((prev)=>({
            ...prev,
            addr:addressObject.fullAddress,
            zoneCode:addressObject.zonecode,
        }));

    };

    return(
        <>
            {/*주소*/}
            <div className="d-flex flex-column mb-3">
                <div className="d-flex align-items-center w-100 mb-2">
                    <FormTag
                        label="우편번호"
                        labelClass="form-title" className="form-control w-25"
                        name="zoneCode"
                        value={userInfo?.zoneCode}
                        placeholder="우편번호"
                        onChange={handleInputChange}
                    />
                    <DaumPostcode onAddressSelect={handleAddressSelect}/>
                </div>
                <div className="d-flex align-items-center w-100 mb-2">
                    <FormTag
                        label="주소"
                        labelClass="form-title" className="form-control"
                        name="addr"
                        value={userInfo?.addr}
                        placeholder="주소"
                        onChange={handleInputChange}
                    />
                </div>

                <div className="d-flex align-items-center w-100">
                    <FormTag
                        label="상세주소"
                        labelClass="form-title" className="form-control"
                        name="detailAddr"
                        value={userInfo?.detailAddr}
                        onChange={handleInputChange}
                        placeholder="상세주소 입력"
                    />
                </div>
            </div>
        </>
    )
}

export default Address;