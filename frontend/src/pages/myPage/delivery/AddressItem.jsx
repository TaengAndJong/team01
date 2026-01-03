import React, {useContext, useEffect, useState} from "react";
import {AddressDispatchContext, AddressStatusContext} from "./AddressComponent";
import EditForm from "./EditForm.jsx";
import {useModal} from "../../common/modal/ModalContext.jsx";


const AddressItem = () => {

    const deliveryData = useContext(AddressStatusContext);
    const {onDelete} = useContext(AddressDispatchContext);
    const [editItem, setEditItem] = useState(null); // 선택된 하나의 주소 객체
    // 기존 배송 수정폼 상태관리변수
    const [showEditForm, setShowEditForm] = useState(false);
    // 모달
    const {openModal,closeModal}= useModal();


    //배송지 등록 저장 시 서버로 보낼 fetch 함수
    const deleteFetch = async (addrId) => {
        //주소에 파라미터값 담아서 서버로 전송

        //try ,catch 구문을 사용하면 좀 더  세부적으로 에러처리 가능
        try{

            const response = await fetch(`/api/mypage/address/delete/${addrId}`, {
                method: 'POST',
            });

            if(!response.ok){
                throw Error(response.statusText);
            }

            const data = await response.json();
            //성공여부에 따른 메시지 받아오기
            console.log("get 요청 성공 data",data);
            console.log("get 요청 성공 data",data.deleteId);
            //클로저 캡쳐(closure capture)
            onDelete(addrId);

            // 유저에게 성공완료 모달 띄울거?
            openModal({
                modalType: "confirm",
                content: <> <p>{data.success}</p></>,
                onConfirm: () => {
                    closeModal();
                },
                onClose: () => {
                    closeModal();
                }
            });

        }catch(e){
            console.log(e);
        }

    }
    //delete 핸들러
    const deleteHandler  = (addrId)=>{
        // console.log("addrId", addrId);
        //deleteFetch(addrId);
        openModal({
            modalType: "confirm",
            content: <> <p>해당배송지를 삭제하겠습니까?</p></>,
            onConfirm: () => {
                deleteFetch(addrId);
                closeModal();
            },
            onClose: () => {
                closeModal();
            }
        });

    }

    const openEditForm = (addrId)=>{
        console.log("addrId", addrId);
        console.log("deliveryData",deliveryData);
        setShowEditForm(true);
        //deliveryData는 객체를 담은 배열
        const targetItem = deliveryData?.find(targetAddrId => targetAddrId.addrId == addrId); // find를 통해 조건에 맞는 배열내부의 하나의 객체를 반환
        console.log("targetItem", targetItem.addrId); // 객체의 Id 값을 구체적으로 지칭해야 함
        if(targetItem.addrId === addrId) {
            setEditItem(targetItem); // 해당 아이디의 데이터를 EditForm 에 전달
        }

    }

    useEffect(() => {
        console.log("deliveryData--- AddressItem", deliveryData);
        console.log("editItem--- AddressItem", editItem);


    },[deliveryData,editItem]);


    return (
        <>

            {deliveryData?.map((item, index) => (
                <div key={index}
                     className=" border border-dark-subtle p-4  rounded-1  bg-white bg-opacity-50 align-items-center mb-2">

                    <div className="d-flex align-items-center w-100 mb-2">
                        <strong className="title me-3">분류</strong>
                        <span className="border-end pe-4">{item.addrType}</span>
                        <strong className="title me-3 ms-4">주소</strong>
                        <div>
                            <span>{item.zoneCode}</span>
                            <span className="me-3">{item.addr}</span>
                            <span>{item.detailAddr}</span>
                        </div>
                        <div className="ms-auto">
                            <button aria-label="배송지변경" className="btn btn-sm custom-btn02 mx-1" onClick={() => {
                                openEditForm(item.addrId)
                            }}>변경
                            </button>
                            <button aria-label="배송지삭제" className="btn btn-sm btn-danger" onClick={() => {
                                deleteHandler(item.addrId)
                            }}>삭제
                            </button>
                            {/*변경 누르면 하단에 EditForm 출력하고 변경 버튼이 저장버튼으로 바뀌기?? 아니면 기존 폼에서 저장까지처리*/}
                        </div>
                    </div>
                    {/*editform*/}

                    {/*  editItem이 true 임을 만족해야 에러가 발생하지 않음 */}
                    {editItem && item.addrId === editItem.addrId && showEditForm && (
                        <div className="d-block">
                            <EditForm editItem={editItem} setEditItem={setEditItem}
                                      setShowEditForm={setShowEditForm}/>
                        </div>
                    )}
                </div>
            ))}

        </>
    )
}

export default AddressItem;


