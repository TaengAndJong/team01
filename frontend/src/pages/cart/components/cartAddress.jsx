import React, {useContext, useEffect, useState} from "react";
import ReusableModal from "../../adminBook/components/modal.jsx";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {CartStateContext} from "../cartComponent.jsx";
import addressList from "../../myPage/delivery/AddressList.jsx";

//객체를 prop로 받아올때   { } <<== 유의하기, 구조분해할당 구조로 받아와야 데이터 분리가능
const CartAddress= ({addrList}) =>{

    console.log("CartAddress addrList-----------",addrList);
    
    //모달 주소 선택 상태관리 변수
    const [selectAddr, setSelectAddr] = useState(null);
    //배송지 목록 상태관리 변수
    const [orderAddr, setOrderAddr] = useState(null);
    //모달 상태관리
    const [show, setShow] = useState(false);
    const handleShow = () => {
        console.log("Show modal");
        setShow(true)
    }
    const handleClose = () => {
        console.log("close modal");
        setShow(false)
    }
    const handleSubmit = () => {
        console.log("handleSubmit");
        setShow(false);
    }
    //배송지 목록 비동기 요청 핸들러
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
            setSelectAddr(data);

        }catch(e){
            console.log(e);
        }

    }

    //배송지변경버튼 핸들러
    const changeAddress = (item) => {
        console.log("변경할 Item info",item);
        // 비동기 요청

    }

    useEffect(() => {
        addrFetch();
    }, []); // 모달 배송지 선택 목록 마운트 시 한 번 fetch 요청

    useEffect(() => {
        if (addrList) {
            setOrderAddr(addrList);
        }
    }, [addrList]); // addrList 변경시 데이터 갱신

    console.log("orderAddr-----------",orderAddr);

    return (
        <>
            <div className="select-address mt-4 mb-5">
            <h5 className="title my-3">배송지</h5>
                {orderAddr ? (
                    <div className="d-flex select-address border border-dark-subtle p-4 bg-white bg-opacity-50 rounded-1">
                        <ul className="d-flex align-items-center">
                            <li className="me-3">
                                <strong className="title me-2">분류</strong>{orderAddr.addrType}
                            </li>
                            <li className="me-3">
                                <strong className="title me-2">우편주소</strong>{orderAddr.zoneCode}
                            </li>
                            <li className="me-3">
                                <strong className="title me-2">주소</strong>{orderAddr.addr}
                                <strong className="title mx-2">상세주소</strong>{orderAddr.detailAddr}
                            </li>
                        </ul>
                        <button aria-label="배송지변경" className="btn btn-sm btn-primary ms-3" onClick={handleShow}>변경
                        </button>
                    </div>
                ) : (
                    <div className="select-address">
                        <button aria-label="배송지 선택" className="btn btn-sm btn-primary ms-3"> 배송지 선택
                        </button>
                    </div>
                )}


                {show && (
                    <Modal show={show} onHide={handleClose} centered>
                    <Modal.Dialog>
                            <Modal.Header closeButton>
                                <Modal.Title>배송지 변경</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <ul>
                                    {selectAddr?.map((item, index) => (
                                        <li key={item.addrId}>
                                            <button className="btn btn-light text-start my-1"
                                                    onClick={() => changeAddress(item)}>
                                                <span>{`No.${index + 1}`}</span>
                                            <span>분류 : {item.addrType}</span>
                                            <span>우편번호 : {item.zoneCode}</span>
                                            <span>주소 : {item.addr}</span>
                                            <span>상세주소 : {item.detailAddr}</span>
                                        </button>
                                    </li>
                                ))}
                                </ul>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button onClick={handleClose}>취소</Button>
                                <Button onClick={handleSubmit}>확인</Button>
                            </Modal.Footer>
                        </Modal.Dialog>
                    </Modal>
                )}
            </div>
        </>

    )
}

export default CartAddress;