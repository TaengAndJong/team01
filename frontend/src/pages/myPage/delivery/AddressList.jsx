import {useContext, useEffect, useState} from "react";
import {AddressStatusContext} from "./AddressComponent.jsx";
import AddressItem from "./AddressItem.jsx";
import AddForm from "./AddForm.jsx";

const AddressList = () => {

    const deliveryData = useContext(AddressStatusContext);
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
        console.log("address Layout",deliveryData);
        if (deliveryData?.length > 3) return; // 3개 초과면 추가 폼 열지 않음
        setShowAddForm(false); // 재 렌더링 되었을때는 폼 닫기
    },[deliveryData]);

    return(
        <>
            <div className="cart d-block clearfix">
                <h3 className="title-border title">목록</h3>

                {/*배송지 선택  title-dotted */}
                <div className="select-address mt-4 mb-5">
                     {/*배송지 있을경우 UI*/}
                    {deliveryData && deliveryData.length > 0 && (
                        <AddressItem setShowAddForm={setShowAddForm}/>
                    )}
                    {/* 배송지 없을 경우 UI*/}
                    {!showAddForm && deliveryData?.length < 3 && (
                        <div className="border border-dark-subtle p-4 rounded-1  bg-white bg-opacity-50 mb-2">
                            <button type="button" className="btn btn-secondary d-inline-block me-2"
                                    onClick={() => {
                                        setShowAddForm(prev => (!prev))
                                    }}>배송지 등록
                            </button>
                            <p className="my-3 p-2 d-inline-block">
                                {deliveryData.length === 0
                                    ? "등록된 배송지가 없습니다. 배송지를 등록해주세요."
                                    : "배송지 추가"}
                            </p>
                        </div>
                    )}
                    {showAddForm && <AddForm setShowAddForm={setShowAddForm}/>}
                </div>

            </div>
        </>
    )
}

export default AddressList;