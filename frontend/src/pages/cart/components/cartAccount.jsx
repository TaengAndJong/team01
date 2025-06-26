const CartAccount = () => {

    return (
        <>
            {/* 합산금액 시작 : 장바구니에 담긴 전체 상품에 대한 계산 */}
            <div className="cart-count d-block clearfix default-border p-3 bg-white bg-opacity-75">
                <ul className="cart-count-list  ul bullet  d-flex justify-content-between align-items-center">
                    <li className="li item-inner d-inline-block  text-cetner">
                        <strong className="tit">선택상품금액</strong>
                        <span className="price"><em>2,0000</em>원</span>
                    </li>
                    <li className="li item-inner d-inline-block text-cetner">
                        <strong className="tit">배송금액</strong>
                        <span className="price"><em>2,000</em>원</span>
                    </li>
                    <li className="li item-inner d-inline-block text-cetner">
                        <strong className="tit">주문금액</strong>
                        <span className="price"><em>22,000</em>원</span>
                    </li>
                    <li className="item-inner d-inline-block text-cetner">
                        <button type="submit" className="btn btn-primary">전체구매</button>
                    </li>
                </ul>
            </div>
        </>
    );
}

export default CartAccount;