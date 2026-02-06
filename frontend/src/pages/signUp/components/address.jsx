import FormTag from "../../../util/form/formTag.jsx";
import DaumPostcode from "../../../util/address/daumPostcode.jsx";
import React from "react";

const Address=({formData,setFormData})=>{

    //input onChange 핸들러
    const inputOnchanghandler = (e) => {
        const { name, value } = e.target; // 입력 필드의 name과 value 가져오기
        setFormData({ ...formData, [name]: value });

        // 아이디 유효성 검사
        if (name === "clientId") {
            const idValidation = validAddrID(value);

        }

    };

    //주소
    const handleAddressSelect = (addressObject) => {

        // 다음 API에서 받은 데이터 infoData에 갱신해주기
        setFormData((prev)=>({
            ...prev,
            addr:addressObject.fullAddress,
            zoneCode:addressObject.zonecode,
        }));

    };

    return(
        <>
            {/*주소*/}
            <div className="addr-info">
                <fieldset className="row col-12 mb-2">
                    <legend className="form-title col-2">전체 주소</legend>
                    <FormTag
                        label="기본주소"
                        labelClass="form-title col-2 sr-only" id="addr" className="form-control mb-2"
                        name="addr"
                        value={formData.addr}
                        readOnly={true}
                        placeholder="기본주소"
                        onChange={inputOnchanghandler}
                    />
                    <DaumPostcode onAddressSelect={handleAddressSelect}/>
                    <FormTag
                        label="상세주소"
                        labelClass="form-title col-2 sr-only" id="detailAddr" className="form-control mb-2"
                        name="detailAddr"
                        value={formData.detailAddr}
                        onChange={inputOnchanghandler}
                        placeholder="상세주소"
                    />
                    <FormTag
                        label="우편번호"
                        labelClass="form-title col-2 sr-only" id="zoneCode" className="form-control mb-2"
                        name="zoneCode"
                        value={formData.zoneCode}
                        placeholder="우편번호"
                        onChange={inputOnchanghandler}
                    />
                </fieldset>
            </div>
        </>
    )
}

export default Address;