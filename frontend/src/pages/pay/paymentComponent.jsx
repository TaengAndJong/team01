import {useLocation} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "axios";
import "@assets/css/payment.css"
import CartItemPrice from "../cart/components/cartItemPrice.jsx";
import PayItem from "./components/payItem.jsx";
import SelectPayment from "./components/selectPayment.jsx";
import PayAllPrice from "./components/payAllPrice.jsx";


const PaymentComponent = () =>{

    const location = useLocation();
    console.log("location----",location?.state);
    // location에 담겨온 state 객체들 구조분해할당
    const {cartIds,payAccount,addrId} = location?.state;
    console.log("cartIds----",cartIds);
    console.log("payAccount----",payAccount);
    console.log("addrId----",addrId);

    //주소 상태관리 ==> 단일 객체로 넘어오면 null이 나을까 {}가 나을까?
    const [address,setAddress] = useState(null);
    //주문도서정보관리 ==> 배열로 넘어오니까 null 이 나을까 [] (빈배열이) 나을까..?
    const [books,setBooks] = useState(null);
    // 결제방식 선택 상태관리
    const [paymentInfo, setPaymentInfo] = useState({
        paymentMethod: "card",
        cardName:"",
        cardNumber: "",
        bankName:"",
        bankAccount: ""
    });


    // 결제컨트롤러로 보낼 비동기요청
    const paymentHandler =()=>{
        //formData 모두 전송
    }

    useEffect(() => {
        axios.get("/api/payment")
            .then((response)=>{
                console.log("response -- get요청",response);
                console.log("response -- get요청33333",response.data);
               const addr = response.data.address;
               const books= response.data.bookList;
                console.log("books--11",books);
                console.log("addr",addr);
               //주소에 데이터 갱신
                setAddress(addr);
               //도서상품 데이터 갱신
                setBooks(books);
            }).catch((error)=>{
                console.log("error---",error);
        });

    },[]);

    return(
        <>

            {/* 필요한 데이터 : 1) 클라이언트의 선택된 배송지 == 이미 선택됨 출력용도 list 태그로 작성 */}
            {/*<CartAddress/>*/}
            {/* 필요한 데이터 : 2) 클라이언트의 장바구니에 담긴 목록조회 ( 도서정보, 가격 ) */}
            {/* 필요한 데이터 : 3) 결제수단 선택 UI : 라디오 버튼, 계좌정보, 카드 결제 */}
            {/* 필요한 데이터 : 4) 결제금액 (배송비 , 전체금액 )*/}
            {/* 필요한 데이터 : 5) 결제 버튼*/}
            {/* 기타 기능 - 결제버튼 누르면 결제 중 로딩 화면 필요*/}
            <div className="page">
                <section className="content">
                    <div className="content-inner custom-border">
                        {/*content*/}
                        <h3 className="paymentForm title-border title">결제정보</h3>
                        <div className="select-address mt-4 mb-5">
                            <h5 className="title my-3">배송지</h5>

                            <div
                                className="d-flex select-address border border-dark-subtle p-4 bg-white bg-opacity-50 rounded-1">
                                {address && (
                                    <ul className="d-flex align-items-center">
                                        <li className="me-3">
                                                <strong className="title me-2">분류</strong>{address.addrType}
                                        </li>
                                        <li className="me-3">
                                            <strong className="title me-2">우편주소</strong>{address.zoneCode}
                                        </li>
                                        <li className="me-3">
                                            <strong className="title me-2">주소</strong>{address.addr}
                                            <strong className="title mx-2">상세주소</strong>{address.detailAddr}
                                        </li>
                                    </ul>
                                    )}
                            </div>
                        </div>
                        <form aria-labelledby="paymentForm" onSubmit={paymentHandler}>
                            {/*결제할 장바구니 목록*/}
                            <section aria-labelledby="cartSectionTitle" className="align-items-center mb-1">
                                <h5 id="cartSectionTitle" className="title my-3 d-block">결제할 목록</h5>
                                <PayItem books={books}/>
                            </section>
                            {/* 결제 수단 선택 */}
                            <SelectPayment paymentInfo={paymentInfo} setPaymentInfo={setPaymentInfo} />
                            {/* 총 결제금액*/}
                            <PayAllPrice />
                        </form>
                        {/*content  end*/}
                    </div>
                </section>
            </div>

        </>
    )
}

export default PaymentComponent;