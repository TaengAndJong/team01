import React from "react";



const PayAllPrice = ({allPrice,deliveryPay}) =>{

    return (
        <>
            <li className="li d-inline-flex align-items-center me-3">
                <i class="icon answer"></i>
                <strong class="fw-bold tultip mx-3">상품금액</strong>
                <em className="fw-bold">{allPrice}</em>원
            </li>
            <li className="li me-3"><span className="fw-bold">+</span></li>
            <li className="li me-3">
                <strong className="fw-bold tultip me-3">배송비</strong>
                <em class="fw-bold">{deliveryPay}</em>원
            </li>
            <li className="li me-3"><span className="fw-bold">=</span></li>
            <li className="li me-3 d-inline-flex align-items-center">
                <strong className="fw-bold mx-3">총 결제금액</strong>
                <span className="total-price">
                    <em className="fw-bold">{allPrice + deliveryPay}</em>
                </span>
                <em className="fw-bold ms-2">원</em>
            </li>
        </>
)
}

export default PayAllPrice;