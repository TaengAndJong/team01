import FormTag from "../../../util/formTag.jsx";
import DaumPostcode from "../../../util/daumPostcode.jsx";
import ReuseBtn from "../../../util/reuseBtn.jsx";
import React, {useContext, useEffect, useState} from "react";
import {AddressDispatchContext, AddressStatusContext} from "./AddressComponent.jsx";

const EditForm = ({editItem,setEditItem,setShowEditForm}) => {

    const {onUpdate} =useContext(AddressDispatchContext);

    // 저장누르면 서버로 데이터 전송
    const updateFetch = async (addrId) =>{
        const response = await fetch(`/api/mypage/address/update/${addrId}`,{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(editItem),
        })

        if(!response.ok){
            throw Error(response.statusText);
        }

        const data = await response.json();
        //성공여부에 따른 메시지 받아오기
        // 폼 닫기
        setShowEditForm(false);

        //상태관리 업데이트(서버에서 처리된 데이터 받아와서 갱신필요)
        onUpdate(data.updateData);

    }

    //input onChange 핸들러
    const handleInputChange = (e) => {
        // 이벤트 타겟 내부의 요소를 객체형으로 구조분해할당
        const { name, value } = e.target;
        //기존 데이터를 유지(...addData) == 스프레이 연산자를 이용해
        // 새로운 데이터( [name]: value )와 병합
        setEditItem({
            ...editItem,
            [name]: value
        });
    };

    //주소 API 핸들러
    const handleAddressSelect = (addressObject) => {
        // 다음 API에서 받은 데이터 infoData에 갱신해주기
        setEditItem((prev)=>({
            ...prev,
            addr:addressObject.fullAddress,
            zoneCode:addressObject.zonecode,
        }));
    };

    useEffect(() => {

    },[editItem])


    return (
            <>
                <div className="edit-form">
                    <div className="my-3 p-2">
                        <form className="deliveryForm">
                            <div className="d-flex flex-column mb-3">
                                <div className="d-flex align-items-center w-100 mb-2">
                                    <FormTag
                                        label="분류"
                                        labelClass="form-title" className="form-control"
                                        id="addrType"
                                        name="addrType"
                                        value={editItem?.addrType}
                                        placeholder="배송지분류"
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="d-flex align-items-center w-100 mb-2">
                                    <FormTag
                                        label="주소"
                                        labelClass="form-title" className="form-control"
                                        name="addr"
                                        value={editItem?.addr}
                                        placeholder="주소"
                                        onChange={handleInputChange}
                                        readOnly={true}
                                    />
                                </div>

                                <div className="d-flex align-items-center w-100 mb-2">
                                    <FormTag
                                        label="우편번호"
                                        labelClass="form-title" className="form-control w-75"
                                        name="zoneCode"
                                        value={editItem?.zoneCode}
                                        placeholder="우편번호"
                                        onChange={handleInputChange}
                                    />
                                    <DaumPostcode onAddressSelect={handleAddressSelect}/>
                                </div>
                                <div className="d-flex align-items-center w-100">
                                    <FormTag
                                        label="상세주소"
                                        labelClass="form-title" className="form-control"
                                        name="detailAddr"
                                        value={editItem?.detailAddr}
                                        onChange={handleInputChange}
                                        placeholder="상세주소 입력"
                                    />
                                </div>
                            </div>
                        </form>
                        <div className="d-flex justify-content-center w-100 mt-4">
                            <ReuseBtn type="button" text="저장" className="btn-primary me-2" id="save" onClick={() => {
                                updateFetch(editItem.addrId)
                            }}/>
                            <ReuseBtn type="reset" text="취소" className="btn-danger" id="reset"
                                      onClick={() => setShowEidtForm(false)}/>
                        </div>
                    </div>
                </div>
            </>
            )
            }

            export default EditForm;