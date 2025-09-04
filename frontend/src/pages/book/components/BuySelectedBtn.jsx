import React from "react";
import {useNavigate} from "react-router-dom";

// 선택도서구매와 바로구매 동일 버튼 사용하게 구현하기
// 버튼은 type으로 구분, 도서 데이터 book,
const BuySelectedBtn = ({type, book, bookCount}) => {

    const navigate = useNavigate();
    console.log("바로구매하기--------book",book);
    console.log("바로구매하기--------type",type);
    const btnName = type ==="selected"? "선택구매" : "바로구매";

    //선택구매 버튼을 누르면 결제페이지로 이동되고, 도서정보도 같이 넘겨줘야함
    const gotoPayment = async (book,type) => {
        console.log(`book ${book}, type ${type}`);

        // 결제페이지로 파라미터를 담아서 이동하기
        navigate("/payment",{
            state:{
                book,
                type :type,
                quantity: bookCount
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