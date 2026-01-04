import React, {useMemo} from "react";
import {getDeliveryPrice, getTotalPrice} from "../../../util/calculatePrice.js";



const cartAllPrice = ({cartList,selectItem,gotoPayment,isDisabled}) =>{

    const allPayment = () => {
            gotoPayment(cartList,selectItem);
    };

    //총 도서가격
    const totalPrice = useMemo(()=>{ // 값 없을 경우 undefined 방지 초기값 설정
        return getTotalPrice(cartList,selectItem); // 파라미터는 클로저 참조(부모컴포넌트에서 넘어오는 파라미터값 사용 , 유틸함수에서 기본값 설정해두어서)
    },[cartList,selectItem])

    //totalPrice를 기준으로 배송비 결정
    const deliveryPrice  = useMemo(()=>{
        return getDeliveryPrice(totalPrice); // 클로저 참조
    },[totalPrice]);
    

    return (
        <>
            <ul className="cart-item-count p-4 mt-5 d-flex align-items-center bg-warning-subtle justify-content-end">
                <li className="li d-inline-flex align-items-center me-3">
                    <i className="icon answer"></i>
                    <strong className="fw-bold tultip mx-3">상품금액</strong>
                    <em className="fw-bold">{totalPrice}</em>원
                </li>
                <li className="li me-3"><span className="fw-bold">+</span></li>
                <li className="li me-3">
                    <strong className="fw-bold tultip me-3">배송비</strong>
                    <em className="fw-bold">{deliveryPrice}</em>원
                </li>
                <li className="li me-3"><span className="fw-bold">=</span></li>
                <li className="li me-3 d-inline-flex align-items-center">
                    <strong className="fw-bold tultip mx-3">총 결제금액</strong>
                    <span className="total-price">
                    <em className="fw-bold">{totalPrice + deliveryPrice}</em>
                    </span>
                    <em className="fw-bold mx-3">원</em>
                    <button type="submit" aria-label="구매하기"
                            className="submit btn btn-dark" onClick={allPayment}
                            disabled={isDisabled}
                    >구매하기
                    </button>
                </li>
                {/*결제 실행 핸들러 필요 */}
                {/*<li className="d-inline">*/}

                {/*</li>*/}

                {/*<li className="li d-inline pe-3">*/}
                {/*    <span className="total-header d-inline-flex  align-items-center">*/}
                {/*        <i className="icon answer"></i><strong className="fw-bold mx-3">총 결제금액</strong>*/}
                {/*    </span>*/}

                {/*    <span className="total-price">*/}
                {/*        /!*<em className="fw-bold">{totalPrice(cartList, selectItem)}</em>*!/*/}
                {/*        <em className="fw-bold">{totalPrice}</em>*/}
                {/*        <span className="fw-bold ms-2">원</span>*/}
                {/*    </span>*/}
                {/*</li>*/}

            </ul>
        </>
    )
}

export default cartAllPrice;