import React from "react";


const cartAllPrice = ({cartList,selectItem,deliveryFee,gotoPayment,totalPrice,isDisabled}) =>{

    const allPayment = () => {
            gotoPayment(cartList,selectItem);
    };

    //cartList에 담긴 도사 가격만 필터링 해서 계산

    return (
        <>
            <ul className="cart-item-count p-4 mt-5 d-flex align-items-center bg-warning-subtle">
                <li className="li d-inline pe-3">
                    <span className="total-header d-inline-flex  align-items-center">
                        <i className="icon answer"></i><strong className="fw-bold mx-3">총 결제금액</strong>
                    </span>

                    <span className="total-price">
                        <em className="fw-bold">{totalPrice(cartList, selectItem)}</em>
                        <span className="fw-bold ms-2">원</span>
                    </span>
                </li>
                {/*결제 실행 핸들러 필요 */}
                <li className="d-inline ms-auto">
                    <button type="submit" aria-label="구매하기"
                            className="submit btn btn-dark" onClick={allPayment}
                            disabled={isDisabled}
                    >구매하기
                    </button>
                </li>
            </ul>
        </>
    )
}

export default cartAllPrice;