import {useEffect, useState} from "react";
import EditForm from "./EditForm.jsx";
import AddForm from "./AddForm.jsx";
import AddressItem from "./AddressItem.jsx";

const AddressComponent = () =>{

    //배송지상태관리 변수
    const [deliveryData, setDeliveryData] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);

    const handleClick = () => {
        // 최대 3개 제한
        if (deliveryData.length > 3) return; // 3개 초과면 추가 폼 열지 않음
        setShowAddForm(prev => !prev); // true ↔ false 토글
    };

    //배송지 등록 저장 시 서버로 보낼 fetch 함수
    const addrFetch = async () => {
        //try ,catch 구문을 사용하면 좀 더  세부적으로 에러처리 가능
        try{

            const response = await fetch("/api/mypage/address",
                {
                    method: "GET",
                })

            if(!response.ok){
                throw Error(response.statusText);
            }

            const data = await response.json();
            //성공여부에 따른 메시지 받아오기
            console.log("get 요청 성공 data",data);
            setDeliveryData(data);
        }catch(e){
            console.log(e);
        }

    }

    useEffect(() => {
        addrFetch();

    },[]);

    console.log("deliveryData-------",deliveryData);

    return (
        <>
            배송지 목록
            1) 배송지 목록이 비어있으면 배송지 등록하기 버튼
            2) 등록 버튼을 누르면 배송지 등록 폼 등장
            3) 등록 === 서버로 전송 insert
            4) 리렌더링 == 등록폼 닫히고 두 번째 배송지 추가하기 메시지 + 배송지 추가버튼 출력
            5) 배송지가 있다면 수정하기 버튼 출력
            6) 수정하기 버튼 클릭 시 수정 폼 등장 및 수정
            7) 다시 수정 목록등장

            {/* 배송지 목록이 없을 경우 보여지는 UI*/}
            배송지 추가 3개까지 가능

            {/* 배송지 목록이 있을경우 보여지는 UI*/}


            <div className="cart d-block clearfix">
                <h3 className="title-border title">장바구니</h3>

                {/*배송지 선택  title-dotted */}
                <div className="select-address mt-4 mb-5">
                    <h5 className="title my-3">배송지</h5>
                    {/* 배송지 있을경우 UI*/}
                    {deliveryData && deliveryData.length > 0 && (
                        <AddressItem deliveryData={deliveryData}/>
                    )}
                    {/* 배송지 없을 경우 UI*/}
                    {!showAddForm && deliveryData.length < 3  && (
                        <div className="border border-dark-subtle p-4 rounded-1  bg-white bg-opacity-50 mb-2">
                            <button type="button" className="btn btn-secondary d-inline-block me-2"
                                    onClick={handleClick}>배송지 등록
                            </button>
                            <p className="my-3 p-2 d-inline-block">
                                {deliveryData.length === 0
                                    ? "등록된 배송지가 없습니다. 배송지를 등록해주세요."
                                    : "배송지 추가"}
                            </p>
                        </div>
                      )}
                    {showAddForm && <AddForm setDeliveryData={setDeliveryData} handleClick={handleClick}/> }


                </div>

                        {/* cartList  */}
                    {/*{cartData && cartData.length > 0 ? addCartList(cartData) : emptyCartList()}*/}

                    {/* cartList  */}

            </div>


            </>
    )
}

export default AddressComponent;