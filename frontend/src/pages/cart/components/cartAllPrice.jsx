


const cartAllPrice = ({cartList,selectItem,deliveryFee,gotoPayment,totalPrice}) =>{

    console.log("cartAllPrice--------cartList",cartList);
    console.log("cartAllPrice--------selectItem",selectItem);
    console.log("cartAllPrice--------deliveryFee",deliveryFee);



    const allPayment = () => {
        console.log("전체가격")
        gotoPayment(cartList,selectItem);
    };

    //cartList에 담긴 도사 가격만 필터링 해서 계산

    return (
        <>

            <ul className="cart-item-count ul bullet border-top border-bottom py-3 mt-5 d-flex">
                <li className="li d-inline-flex  align-items-center pe-3">
                    <span className="me-4">총 결제금액</span>
                    <span className="price"><em>{totalPrice(cartList,selectItem)}</em>원</span>
                </li>
                {/*결제 실행 핸들러 필요 */}
                <li className="d-inline-flex align-items-center ms-auto">
                    <button type="submit" aria-label="구매하기"
                            className="submit btn btn-secondary" onClick={allPayment}>구매하기
                    </button>
                </li>
            </ul>
        </>
    )
}

export default cartAllPrice;