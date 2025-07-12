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
        payMethod: "card",
        cardName:"",
        cardNumber: "",
        bankName:"",
        bankAccount: "",
        payAccount:"",
        addrId:"",
        quantity:"",
        cartIds:cartIds
    });

    console.log("addrId---------",addrId)
    console.log("books---------",books)

    //1.필요한 데이터는 books의 도서들 가격 의 총합 + 배송비
    // 2. 결제버튼 누르면 paymentInfo 서버로 submit할 핸들러 함수
    //reduce는 배열을 순회하면서 각 요소의 값을 누적하여 반환하는 함수로,
    //accPrice의 초기값은 0을 지정하고 item의 계산값을 누적하여 반환
    // null 병합 연산자로 값이 null이면 0을 대체해서 에러 방지
    const allPrice = (books?.reduce((accPrice, item) => {
        const eachPrice = item.book.bookPrice;
        const quantity = item.quantity;
        accPrice = accPrice + (eachPrice *  quantity);
        return accPrice;
    },0) ?? 0) ; // 계산된 값에 + 배송비

    // 결제컨트롤러로 보낼 비동기요청
    const submitPaymentHandler = async (paymentInfo)=>{

        try{
            const response=  await  axios.post("/api/payment",paymentInfo)
            console.log("response",response)
        }catch(error){
            console.log(error);
        }

    }
    //결제버튼 onClick 이벤트핸들러
    const onClickPayment = async (e)=>{
        //form submit 발생 방지
        e.preventDefault();
        //paymentInfo의 현재값 유지, payAccount만 바꿈
        // ==> setPaymentInfo를 바로사용하면 리렌더링이 안될 수 있음
        // 원본 객체를 안전하게 유지할 수 있는 참조객체를 만들어서 값을 변경해줘야 함
        const updatedPaymentInfo = {
            ...paymentInfo,
            payAccount: allPrice,
            addrId:address?.addrId, // 요기에서 addrId 와 bookList의 값을 지정해줘야 서버로 넘어감
            bookList:books?.map((item)=>({
                bookId:item.book.bookId,
                quantity:item.quantity,
            }))
        };

        console.log("updatedPaymentInfo",updatedPaymentInfo);


        //paymentInfo의 payAccount 값 담아주기
        setPaymentInfo(updatedPaymentInfo);
        //여기서 한 번더 검증 필요

        console.log("결제버튼 클릭 ",paymentInfo)
        //서버로 비동기 요청 보낼 함수 실행,  서버로 보내줄 파라미터 넘겨주기
        await submitPaymentHandler(paymentInfo); // 이 핸들러 끝날 때까지 기다려라! ==> async , await 사용안하면 onclick 이벤트가  먼저 끝나버림
        // 이 다음 실행

        console.log("onClick 끝");
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
                        <form aria-labelledby="paymentForm" onSubmit={submitPaymentHandler}>
                            {/*결제할 장바구니 목록*/}
                            <section aria-labelledby="cartSectionTitle" className="align-items-center mb-1">
                                <h5 id="cartSectionTitle" className="title my-3 d-block">결제할 목록</h5>
                                <PayItem books={books}/>
                            </section>
                            {/* 결제 수단 선택 */}
                            <SelectPayment paymentInfo={paymentInfo} setPaymentInfo={setPaymentInfo}/>
                            {/* 총 결제금액*/}
                            <section className="mt-4" aria-labelledby="priceSummary">
                                <h5 id="priceSummary" className="title my-3">결제 금액 요약</h5>
                                <ul className="border border-dark-subtle p-4 bg-white bg-opacity-50 rounded-1 d-flex align-items-center">
                                    <PayAllPrice deliveryPay={2000} allPrice={allPrice}/>
                                    <li className="ms-auto ">
                                        <button type="submit" className="btn btn-danger" onClick={onClickPayment}>결제하기</button>
                                    </li>
                                </ul>
                            </section>
                        </form>
                        {/*content  end*/}
                    </div>
                </section>
            </div>

        </>
)
}

export default PaymentComponent;