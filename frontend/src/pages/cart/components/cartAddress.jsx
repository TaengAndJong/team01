import React, {useContext, useEffect, useState} from "react";
import ReusableModal from "../../adminBook/components/modal.jsx";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {CartStateContext} from "../cartComponent.jsx";
import addressList from "../../myPage/delivery/AddressList.jsx";
import {useModal} from "../../common/modal/ModalContext.jsx";

//객체를 prop로 받아올때   { } <<== 유의하기, 구조분해할당 구조로 받아와야 데이터 분리가능
const CartAddress= ({addrList}) =>{

   // console.log("CartAddress addrList-----------",addrList);
    
    //모달 주소 선택 상태관리 변수
    const [selectAddr, setSelectAddr] = useState(null);
    //변경할 주소 아이디 상태관리변수
    const [selectedId, setSelectedId] = useState(null);

    //배송지 목록 상태관리 변수
    const [orderAddr, setOrderAddr] = useState(null);

    //배송지 선택 개인모달
    const [show, setShow] = useState(false);
    const handleShow = () => {
        setShow(true)
    }
    const handleClose = () => {
        setShow(false)
    }
    const handleSubmit = () => {
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
            //console.log("get 요청 성공 data",data);
            setSelectAddr(data);

        }catch(err){
            console.log(" 에러 데이터",err);
        }

    }

    //배송지변경버튼 핸들러
    const changeAddrFetch = async () => {

       //서버로 비동기 요청보내기
        const response = await fetch(
            "/api/cart/addr",
            {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({selectedAddrId: selectedId}),
            }
        );

        if(!response.ok){
            throw Error(response.statusText);
        }

        const data = await response.json();
        setOrderAddr(data.updateAddr); // 기존 배송주소 데이터 갱신
        setShow(false);// 모달창 닫기
    }

    useEffect(() => {
        addrFetch();
    }, []); // 모달 배송지 선택 목록 마운트 시 한 번 fetch 요청

    useEffect(() => {
        if (addrList) {
            setOrderAddr(addrList);
        }
    }, [addrList]); // addrList 변경시 데이터 갱신

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
                        <button aria-label="배송지변경" className="btn btn-sm custom-btn02 ms-3" onClick={handleShow}>변경
                        </button>
                    </div>
                ) : (
                    <div className="select-address">
                        <button aria-label="배송지 등록" className="btn btn-sm btn-primary ms-3"> 배송지 등록
                        </button>
                    </div>
                )}


                {show && (
                    <Modal show={show} onHide={handleClose} centered>
                    <Modal.Dialog className={"address-change"}>
                            <Modal.Header closeButton>
                                <Modal.Title>배송지 변경</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <ul>
                                    {selectAddr?.map((item, index) => (
                                        <li key={item.addrId} className="my-2">
                                            <label key={item.addrId} className="address-radio text-start">
                                                {/*<span><em className="title">addrId</em>  {item.addrId}</span>*/}
                                                <div className="d-flex align-items-center">
                                                    <input
                                                        className="me-3"
                                                        type="radio"
                                                        name="address"
                                                        value={item.addrId}
                                                        checked={selectedId === item.addrId}
                                                        onChange={() => setSelectedId(item.addrId)}
                                                    />
                                                    <em className="title tultip normal">등록주소</em>{index + 1}
                                                </div>
                                                <span className="d-inline-flex align-items-center"><em className="title tultip">분류</em> {item.addrType}</span>
                                                <span className="d-inline-flex align-items-center"><em className="title tultip">주소</em>{item.addr}</span>
                                                <span className="d-inline-flex align-items-center"><em className="title tultip">상세주소</em> {item.detailAddr}</span>
                                                <span className="d-inline-flex align-items-center"><em className="title tultip">우편번호</em> {item.zoneCode}</span>
                                            </label>

                                        </li>
                                    ))}
                                </ul>
                            </Modal.Body>
                        <Modal.Footer>
                            <Button type="button" className="btn btn-danger" onClick={handleClose}>취소</Button>
                            <Button type="button" className="btn btn-dark"  onClick={()=>changeAddrFetch()}>확인</Button>
                        </Modal.Footer>
                        </Modal.Dialog>
                    </Modal>
                )}
            </div>
        </>

    )
}

export default CartAddress;