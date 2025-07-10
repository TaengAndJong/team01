import React from "react";


const PayAllPrice = () =>{

    return (
        <>
            <section className="mt-4" aria-labelledby="priceSummary">
                <h5 id="priceSummary" className="title my-3">결제 금액 요약</h5>
                <ul className="border border-dark-subtle p-4 bg-white bg-opacity-50 rounded-1 d-flex align-items-center">
                    <li className="me-3"><span className="title me-3">상품금액</span>2000원</li>
                    <li className="me-3"><span className="title">+</span></li>
                    <li className="me-3"><span className="title me-3">배송비</span>2000원</li>
                    <li className="me-3"><span className="title">=</span></li>
                    <li className="me-3"><span className="title me-3">총 결제금액</span>4000원</li>
                    <li className="me-3 ms-auto">
                        <button type="submit" className="btn btn-danger">결제하기</button>
                        <div className="">
                            {/*<button type="submit" disabled={loading}>*/}
                            {/*    {loading ? "결제 진행중..." : "결제하기"}*/}
                            {/*</button>*/}
                        </div>
                    </li>
                </ul>
                {/* 5. 결제 버튼 */}

            </section>
        </>
    )
}

export default PayAllPrice;