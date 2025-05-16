    const CartList = () => {

        return (
            <>
                <div className="cart d-block">
                    <h3 className="title">장바구니</h3>
                    <label htmlFor="All"><input type="checkbox" id="All"></input>전체선택</label>
                    <ul className="cart-list d-block">
                        <li className="cart-item">
                            <div className="item-inner">
                                <label htmlFor="check01"><input type="checkbox" id="check01"></input>선택삭제</label>
                                <div className="img">
                                    <img src="noimg.jpg" alt="노이미지"/>
                                </div>
                                <div className="desc">
                                    <strong className="title">도서제목</strong>
                                    <ul className="info-list">
                                        <li className=""><span className="">저자</span>김테스트</li>
                                        <li className=""><span className="">발행일</span>김테스트</li>
                                        <li className=""><span className="">출판사</span>김테스트</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="item-inner">
                                <strong className="title">상품금액</strong>
                                <span className="price"><em>20,000</em>원</span>
                            </div>
                            <div className="item-inner">
                                <strong className="title">배송금액</strong>
                                <span className="price"><em>2,000</em>원</span>
                            </div>
                        </li>
                    </ul>
                    {/* 합산금액 시작 : 장바구니에 담긴 전체 상품에 대한 계산 */}
                    <div className="cart-count d-block">
                        <ul className="cart-count-list d-flex">
                            <li className="item-inner">
                                <strong className="title">선택상품금액</strong>
                                <span className="price"><em>2,0000</em>원</span>
                            </li>
                            <li className="item-inner">
                                <strong className="title">배송금액</strong>
                                <span className="price"><em>2,000</em>원</span>
                            </li>
                            <li className="item-inner">
                                <strong className="title">주문금액</strong>
                                <span className="price"><em>22,000</em>원</span>
                            </li>
                            <li className="item-inner">
                                <button type="submit">주문하기</button>
                            </li>
                        </ul>
                    </div>
                    {/* 합산금액 끝  */}
                </div>

            </>
        )

    }