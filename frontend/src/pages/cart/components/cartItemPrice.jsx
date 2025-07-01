const CartItemPrice = ({ bookPrice, quantity, deliveryFee }) => {

    const totalPrice = bookPrice * quantity + deliveryFee;

    console.log("totalPrice--- 개별도서 토탈가격",totalPrice);

    return (
        <>
            <ul className="cart-item-count ul bullet border-top border-bottom py-3 mt-5 d-flex">
                <li className="li d-inline-flex  align-items-center pe-3">
                    <span className="me-4">결제금액</span>
                    <span className="price"><em>{bookPrice}</em>원</span>
                </li>
                <li className="li d-inline-flex  align-items-center pe-3">
                    <span className="mx-4"> x </span>
                    <span className="price"><em>{quantity}</em></span>
                </li>
                <li className="li d-inline-flex align-items-center px-3">
                    <span className="me-4">+</span>
                    <span className="me-4">배송금액</span>
                    <span className="price"><em>{deliveryFee}</em>원</span>
                </li>
                <li className="li d-inline-flex align-items-center px-3">
                    <span className="me-4">=</span>
                    <span className="me-4">총 금액</span>
                    <span className="price"><em>{totalPrice}</em>원</span>
                </li>
                {/*결제 실행 핸들러 필요 */}
                <li className="d-inline-flex align-items-center ms-auto">
                    <button type="submit" aria-label="구매하기"
                            className="submit btn btn-secondary">선택도서구매
                    </button>
                </li>
            </ul>
        </>
    )
}

export default CartItemPrice;