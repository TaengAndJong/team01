import BuySelectedBtn from "../../book/components/BuySelectedBtn.jsx";


const CartItemPrice = ({ cartList, deliveryFee,isDisable}) => {

    const total = cartList.book.bookPrice * cartList.book.quantity + deliveryFee;

  //  console.log("cartList--- 개별도서 토탈가격-- cartItemPrice",cartList);


    return (
        <>
            <ul className="cart-item-count border-top border-bottom py-3 mt-5 d-flex">
                <li className="li d-inline-flex  align-items-center pe-3">
                    <span className="tultip me-4">결제금액</span>
                    <span className="price"><em className="fw-bold">{cartList.book.bookPrice}</em>원</span>
                </li>
                <li className="li d-inline-flex  align-items-center pe-3">
                    <span className="mx-4"> x </span>
                    <span className="price"><em className="fw-bold">{cartList.book.quantity}</em></span>
                </li>
                <li className="li d-inline-flex align-items-center px-3">
                    <span className="me-4">+</span>
                    <span className="tultip me-4">배송금액</span>
                    <span className="price"><em className="fw-bold">{deliveryFee}</em>원</span>
                </li>
                <li className="li d-inline-flex align-items-center px-3">
                    <span className="me-4">=</span>
                    <span className="price"><em className="fw-bold">{total}</em>원</span>
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