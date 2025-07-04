import {useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import CartAddress from "../cart/components/cartAddress.jsx";

const Payment = () =>{

    const location = useLocation();
    console.log("location----",location?.state);
    // location에 담겨온 state 객체들 구조분해할당
    const {cartIds,payAccount,addrId} = location?.state;
    console.log("cartIds----",cartIds);
    console.log("payAccount----",payAccount);
    console.log("addrId----",addrId);

    // 결제컨트롤러로 보낼 비동기요청
    const paymentHandler =()=>{
        //formData 모두 전송
    }

    useEffect(() => {


        axios.get("/api/payment")
            .then((response)=>{
                console.log("response -- get요청",response);
            }).catch((error)=>{
                console.log("error---",error);
        });

    },[])

    return(
        <>
        {/* 필요한 데이터 : 1) 클라이언트의 선택된 배송지 == 이미 선택됨 출력용도 list 태그로 작성 */}
        {/*<CartAddress/>*/}
        {/* 필요한 데이터 : 2) 클라이언트의 장바구니에 담긴 목록조회 ( 도서정보, 가격 ) */}
        {/* 필요한 데이터 : 3) 결제수단 선택 UI : 라디오 버튼, 계좌정보, 카드 결제 */}
        {/* 필요한 데이터 : 4) 결제금액 (배송비 , 전체금액 )*/}
        {/* 필요한 데이터 : 5) 결제 버튼*/}
        {/* 기타 기능 - 결제버튼 누르면 결제 중 로딩 화면 필요*/}
            <h3 className="paymentForm">결제 정보</h3>
            <form aria-labelledby="paymentForm" onSubmit={paymentHandler}>
                {/*결제할 장바구니 목록*/}
                <section aria-labelledby="cartSectionTitle" className="d-flex align-items-center mb-1">
                    <h5 id="cartSectionTitle" className="">장바구니 목록</h5>
                    <ul className="cart-list">
                        <li className="cart-item mb-2">


                        </li>
                            {/*{cartItems.map((item) => (*/}
                            {/*    <li key={item.id}>*/}
                            {/*        <p><strong>{item.bookVO.bookName}</strong></p>*/}
                            {/*        <p>수량: {item.quantity}</p>*/}
                            {/*        <p>가격: {item.bookVO.bookPrice.toLocaleString()}원</p>*/}
                            {/*    </li>*/}
                            {/*))}*/}
                    </ul>
                </section>
                {/* 결제 수단 선택 */}
                <fieldset>
                    <legend>결제 수단 선택</legend>
                    <ul>
                        <li>
                            <input type="radio" id="card" name="paymentMethod" value="CARD"/>
                            <label htmlFor="card">신용/체크카드</label>
                        </li>
                        <li>
                            <input type="radio" id="bank" name="paymentMethod" value="bank"/>
                            <label htmlFor="card">계좌이체</label>
                        </li>
                    </ul>
                </fieldset>
                {/*계좌번호 입력 또는 카드번호 입력 UI 출력 필요*/}
                <section className="mt-4" aria-labelledby="priceSummary">
                    <h5 id="priceSummary">결제 금액 요약</h5>
                    <p>상품 금액: 원</p>
                    <p>배송비: 원</p>
                    <p><strong>총 결제 금액: 원</strong></p>
                </section>
                {/* 5. 결제 버튼 */}
                <div className="mt-4">
                    <button type="submit">결제하기</button>
                        {/*<button type="submit" disabled={loading}>*/}
                        {/*    {loading ? "결제 진행중..." : "결제하기"}*/}
                        {/*</button>*/}
                </div>
            </form>
        </>
)
}

export default Payment;