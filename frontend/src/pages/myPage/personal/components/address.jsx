

import React, {useState} from "react";
import FormTag from "@util/form/formTag.jsx";
import DaumPostcode from "@util/address/daumPostcode.jsx";

const Address=({userInfo,setUserInfo})=>{

    //
    const [msg,setMsg]=useState({});
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

            <fieldset className="addr-info d-flex col-12 mb-2">

                    <legend className="form-title col-2">전체 주소</legend>
                        <FormTag
                            label="주소"
                            labelClass="form-title col-2 sr-only" id="addr" className="form-control mb-2"
                            name="addr"
                            value={userInfo?.addr}
                            placeholder="주소"
                            onChange={handleInputChange}
                        />
                        <DaumPostcode onAddressSelect={handleAddressSelect}/>
                        <FormTag
                            label="상세주소"
                            labelClass="form-title col-2 sr-only" id="detailAddr" className="form-control"
                            name="detailAddr"
                            value={userInfo?.detailAddr}
                            onChange={handleInputChange}
                            placeholder="상세주소 입력"
                        />
                        <FormTag
                            label="우편번호"
                            labelClass="form-title col-2 sr-only" id="zoneCode" className="form-control mb-2"
                            name="zoneCode"
                            value={userInfo?.zoneCode}
                            placeholder="우편번호"
                            onChange={handleInputChange}
                        />
            </fieldset>
        </>
)
}

export default Address;