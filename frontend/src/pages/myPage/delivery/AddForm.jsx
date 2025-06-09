import FormTag from "../../../util/formTag.jsx";
import DaumPostcode from "../../../util/daumPostcode.jsx";
import React, {useContext, useEffect} from "react";
import ReuseBtn from "../../../util/reuseBtn.jsx";
import {AddressStatusContext} from "./AddressComponent.jsx";

const AddForm = ({setShowAddForm}) => {

    const {deliveryData,setDeliveryData} = useContext(AddressStatusContext);
    const [addrData, setAddrData] = React.useState({
        addrType:"",
        addr:"",
        zoneCode:"",
        detailAddr:""
    });

    //input onChange 핸들러
    const handleInputChange = (e) => {
        // 이벤트 타겟 내부의 요소를 객체형으로 구조분해할당
        const { name, value } = e.target;
        console.log("name", name);
        console.log("value", value);
        //기존 데이터를 유지(...addData) == 스프레이 연산자를 이용해
        // 새로운 데이터( [name]: value )와 병합
        setAddrData({
            ...addrData,
            [name]: value
        });
    };
    
    //주소 API 핸들러
    const handleAddressSelect = (addressObject) => {
        // 다음 API에서 받은 데이터 infoData에 갱신해주기
         setAddrData((prev)=>({
            ...prev,
            addr:addressObject.fullAddress,
            zoneCode:addressObject.zonecode,
        }));
    };

    console.log("addrData-------",addrData);

    //배송지 등록 저장 시 서버로 보낼 fetch 함수
    const saveAddrFetch = async () => {

        //try ,catch 구문을 사용하면 좀 더  세부적으로 에러처리 가능
        try{

            const response = await fetch("/api/mypage/address/save",
                {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body:JSON.stringify(addrData),
            })

            if(!response.ok){
                throw Error(response.statusText);
            }

            const data = await response.json();
            //성공여부에 따른 메시지 받아오기
            console.log("저장성공 data",data);
            //추가완료 후 목록 재요청 ==> 이렇게 안하려면 ContextAPI 사용하기
            const getRequest = await fetch('/api/mypage/address');
            const updatedList = await getRequest.json();
            setDeliveryData(updatedList);
          
        }catch(e){
            console.log(e);
        }
        
    }

    useEffect(() => {


    },[deliveryData]);
    return (
        <>
            <div className="my-3 p-2">
                <form className="deliveryForm">
                    <div className="d-flex flex-column mb-3">
                        <div className="d-flex align-items-center w-100 mb-2">
                            <FormTag
                                label="분류"
                                labelClass="form-title" className="form-control"
                                name="addrType"
                                value={addrData.addrType}
                                placeholder="배송지분류"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="d-flex align-items-center w-100 mb-2">
                            <FormTag
                                label="주소"
                                labelClass="form-title" className="form-control"
                                name="addr"
                                value={addrData.addr}
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
                                value={addrData.zoneCode}
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
                                value={addrData.detailAddr}
                                onChange={handleInputChange}
                                placeholder="상세주소 입력"
                            />
                        </div>
                    </div>
                </form>
                <div className="d-flex justify-content-center w-100 mt-4">
                    <ReuseBtn type="button" text="저장" className="btn-primary me-2" id="save" onClick={saveAddrFetch}/>
                    <ReuseBtn type="reset" text="취소" className="btn-danger" id="reset" onClick={() => setShowAddForm(false)}/>
                </div>
            </div>
        </>
    )


}

export default AddForm;