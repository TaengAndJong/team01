import React from "react";



const PayAllPrice = ({allPrice,deliveryPay}) =>{

    return (
        <>
            <li className="me-3"><span className="title me-3">상품금액</span>{allPrice}</li>
            <li className="me-3"><span className="title">+</span></li>
            <li className="me-3"><span className="title me-3">배송비</span>{deliveryPay}</li>
            <li className="me-3"><span className="title">=</span></li>
            <li className="me-3"><span className="title me-3">총 결제금액</span>{allPrice+deliveryPay}<span className="title ms-2">원</span></li>
        </>
    )
}

export default PayAllPrice;