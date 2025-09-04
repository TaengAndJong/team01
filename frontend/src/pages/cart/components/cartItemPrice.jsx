import BuySelectedBtn from "../../book/components/BuySelectedBtn.jsx";


const CartItemPrice = ({ cartList,gotoPayment, deliveryFee}) => {

    const total = cartList.book.bookPrice * cartList.quantity + deliveryFee;

    console.log("cartList--- 개별도서 토탈가격",cartList);


    return (
        <>
            <ul className="cart-item-count ul bullet border-top border-bottom py-3 mt-5 d-flex">
                <li className="li d-inline-flex  align-items-center pe-3">
                    <span className="me-4">결제금액</span>
                    <span className="price"><em>{cartList.book.bookPrice}</em>원</span>
                </li>
                <li className="li d-inline-flex  align-items-center pe-3">
                    <span className="mx-4"> x </span>
                    <span className="price"><em>{cartList.book.quantity}</em></span>
                </li>
                <li className="li d-inline-flex align-items-center px-3">
                    <span className="me-4">+</span>
                    <span className="me-4">배송금액</span>
                    <span className="price"><em>{deliveryFee}</em>원</span>
                </li>
                <li className="li d-inline-flex align-items-center px-3">
                    <span className="me-4">=</span>
                    <span className="me-4">금액</span>
                    <span className="price"><em>{total}</em>원</span>
                </li>
                <li className="d-inline-flex align-items-center ms-auto">
                    {/*기존 book객체에서 quantity 만 수정*/}
                    <BuySelectedBtn type={"selected"} book={ {...cartList.book, quantity: cartList.book.quantity ?? 1} }/>


                    <button type="button" aria-label="선택도서구매"
                            className="btn btn-secondary" onClick={() => {
                        gotoPayment(cartList, cartList.cartId)
                    }}>선택도서구매
                    </button>
                </li>
            </ul>
        </>
    )
}

export default CartItemPrice;