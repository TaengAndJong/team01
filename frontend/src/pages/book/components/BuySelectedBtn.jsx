import React from "react";
import {useNavigate} from "react-router-dom";

// 선택도서구매와 바로구매 동일 버튼 사용하게 구현하기

const BuySelectedBtn = ({book}) => {

    const navigate = useNavigate();

    console.log("바로구매하기--------book",book);
    //선택구매 버튼을 누르면 결제페이지로 이동되고, 도서정보도 같이 넘겨줘야함
    //결제 핸들러
    const gotoPayment=()=>{
        console.log("payment gotoPayment");
            //결제페이지로 이동할 때 필요한 파라미터 navigate객체에 담아서 보내주기
            console.log("결제페이지로 이동");
            navigate("/payment",{
                state:{
                    bookId: book?.bookId,
                    payAccount :book?.bookPrice,
                    addrId: "",
                }
            });
        //end
    }
    //gotoPayment End

    return (
        <>
            <button type="button" aria-label="선택구매" className="submit btn btn-dark" onClick={()=> gotoPayment()}>선택구매
            </button>
        </>
    )
}

export default BuySelectedBtn;