import FormTag from "../../../util/form/formTag.jsx";
import DaumPostcode from "../../../util/address/daumPostcode.jsx";
import React from "react";

const Address=({formData,setFormData,msg,setMsg})=>{

    //input onChange 핸들러
    const handleInputChange = (e) => {
        const { name, value } = e.target; // 입력 필드의 name과 value 가져오기
        setFormData({ ...formData, [name]: value });

        // 아이디 유효성 검사
        if (name === "clientId") {
            const idValidation = validID(value);
            setMsg((prev) => ({
                ...prev,
                errorId: idValidation.valid ? "" : idValidation.message,
            }));
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
                    <div className="row col-12  mb-2">
                        <FormTag
                            label="주소"
                            labelClass="form-title col-2" id="addr" className="form-control"
                            name="addr"
                            value={formData.addr}
                            placeholder="주소"
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="row col-12 mb-2">
                        <FormTag
                            label="우편번호"
                            labelClass="form-title col-2" id="zoneCode" className="form-control"
                            name="zoneCode"
                            value={formData.zoneCode}
                            placeholder="우편번호"
                            onChange={handleInputChange}
                        />
                        <DaumPostcode onAddressSelect={handleAddressSelect}/>
                    </div>
                    <div className="row col-12 mb-2">
                        <FormTag
                            label="상세주소"
                            labelClass="form-title col-2" id="detailAddr" className="form-control"
                            name="detailAddr"
                            value={formData.detailAddr}
                            onChange={handleInputChange}
                            placeholder="상세주소 입력"
                        />
                    </div>
                </div>
            </>
            )
            }

            export default Address;