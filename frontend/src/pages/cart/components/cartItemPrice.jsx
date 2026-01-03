import BuySelectedBtn from "../../book/components/BuySelectedBtn.jsx";


const CartItemPrice = ({ cartList,isDisable,totalPrice}) => {
    //부모컴포넌트에서 useMemo로 호출한 totalPrice 받아옴

    return (
        <>
            <ul className="cart-item-count border-top border-bottom py-3 mt-5 d-flex">
                <li className="li d-inline-flex  align-items-center pe-3">
                    <span className="tultip me-4">상품금액</span>
                    <span className="price"><em className="fw-bold">{cartList.book.bookPrice}</em>원</span>
                </li>
                <li className="li d-inline-flex  align-items-center pe-3">
                    <span className="mx-4"> x </span>
                    <span className="tultip me-4">수량</span>
                    <span className="price"><em className="fw-bold">{cartList.book.quantity}</em>권</span>
                </li>
                <li className="li d-inline-flex align-items-center px-3">
                    <span className="me-4">=</span>
                    <span className="price"><em className="fw-bold">{totalPrice}</em>원</span>
                </li>
                <li className="d-inline-flex align-items-center ms-auto">
                    {/*기존 book객체에서 quantity 만 수정*/}
                    <BuySelectedBtn type={"selected"}
                                    cartId={cartList.cartId}
                                    isDisable={isDisable}
                                    book={ {...cartList.book, quantity: cartList.book.quantity ?? 1} }
                    />
                </li>
            </ul>
        </>
    )
}

export default CartItemPrice;