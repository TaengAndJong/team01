import React from "react";
import {useNavigate} from "react-router-dom";
import cartList from "../../cart/components/cartList.jsx";

// 선택도서구매와 바로구매 동일 버튼 사용하게 구현하기
// 버튼은 type으로 구분, 도서 데이터 book,
const BuySelectedBtn = ({type, book,cartId}) => {

    const params = {type,book,cartId};
    const navigate = useNavigate();
    // console.log("구매하기 --------book",book);
    // console.log("구매하기--------type",type);
    // console.log("단건구매 장바구니아이디--------cartId",cartId);
    //단건구매일때에는 cartId도 같이 결제페이지로 넘겨줘야함
    // 단건구매(selected)일 경우에만 cartId 추가
    if (type === "selected" && cartId) {
        params.cartId = cartId;
    }

    const btnName = type ==="selected"? "단건구매" : "바로구매";

    //선택구매 버튼을 누르면 결제페이지로 이동되고, 도서정보도 같이 넘겨줘야함
    const gotoPayment = async (book,type) => {
        // console.log(`book ${book}, type ${type}`);
        // console.log(`cartId ${cartId}`);
        // 도서정보, 버튼type, cartId
        // 결제페이지로 파라미터를 담아서 이동하기
        navigate("/payment",{
            state:{
                book,
                type :type,
                cartId: type === "selected" ? cartId : null // 결제페이지에서 null 체크 필요
            }
        });

    }

    return (
        <>
            <button type="button" aria-label={btnName}
                    className="submit btn btn-dark"
                    onClick={()=> gotoPayment(book,type)}>
                {btnName}
            </button>
        </>
    )
}

export default BuySelectedBtn;