import "@assets/css/cart/cartList.css"


const CartList = () => {

        return (
            <>
                <div className="cart d-block clearfix">
                    <h3 className="title-border title">장바구니</h3>

                    {/*배송지 선택  title-dotted */}
                    <div className="select-address mt-4 mb-5">
                        <h5 className="title my-3">배송지</h5>
                        <dl className="d-flex border border-dark-subtle p-4  rounded-1  bg-white bg-opacity-50 align-items-center">
                            <dt className="title me-3">분류</dt>
                            <dd className="border-end pe-4">집</dd>
                            <dt className="title me-3 ms-4">상세주소</dt>
                            <dd>배송 주소등록한 배송지 기준 빠른배송 상품을 보실 수 있습니다.
                                <button aria-label="배송지변경" className="btn btn-sm btn-primary ms-3">변경</button>
                            </dd>
                        </dl>

                    </div>


                    {/*label 내부에 input 기입 시, htmlFor 기입 불필요*/}
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <label className="">
                            <input type="checkbox" name="check-all" aria-label="전체 선택"/>
                            전체선택
                        </label>
                        <button aria-label="삭제하기" className="cart btn btn-danger">삭제하기</button>
                    </div>

                    <ul className="cart-list">
                        <li className="cart-item mb-2">
                            <div className="item-inner d-flex card flex-row default-border position-relative p-4 mb-2 ">
                                <label className="position-absolute check-one" htmlFor="check01"><input type="checkbox" id="check01"></input>선택삭제</label>
                                <div className="card-header border-end rounded-4 overflow-hidden">
                                    <div className="img-box">
                                        <div className="img-inner">
                                            <img className="img" src="/src/assets/images/noimg.png" alt="노이미지"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="bookInfo card-body">
                                    <strong className="book-title title-dotted d-block">도서제목</strong>
                                    <ul className="ul bullet">
                                        <li className="li"><span className="tit">저자</span>김테스트</li>
                                        <li className="li"><span className="tit">발행일</span>김테스트</li>
                                        <li className="li"><span className="tit">출판사</span>김테스트</li>
                                        <li className="li"><span className="tit">가격</span><em>20,0000</em>원</li>

                                    </ul>
                                    <ul className="cart-item-count ul bullet border-top border-bottom py-3 mt-5 d-flex">
                                        <li className="li d-inline-flex  align-items-center pe-3">
                                            <span className="tit me-4">상품금액</span>
                                            <span className="price"><em>20,000</em>원</span>
                                        </li>
                                        <li className="li d-inline-flex align-items-center px-3">
                                            <span className="tit me-4">배송금액</span>
                                            <span className="price"><em>2,000</em>원</span>
                                        </li>
                                        <li className="d-inline-flex align-items-center ms-auto">
                                            <button type="submit" aria-label="구매하기" className="submit btn btn-secondary">선택도서구매</button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </li>
                    </ul>
                    {/* 합산금액 시작 : 장바구니에 담긴 전체 상품에 대한 계산 */}
                    <div className="cart-count d-block clearfix default-border p-3 bg-white bg-opacity-75">
                        <ul className="cart-count-list  ul bullet  d-flex justify-content-between align-items-center">
                            <li className="li item-inner d-inline-block  text-cetner">
                                <strong className="tit">선택상품금액</strong>
                                <span className="price"><em>2,0000</em>원</span>
                            </li>
                            <li className="li item-inner d-inline-block text-cetner">
                                <strong className="tit">배송금액</strong>
                                <span className="price"><em>2,000</em>원</span>
                            </li>
                            <li className="li item-inner d-inline-block text-cetner">
                                <strong className="tit">주문금액</strong>
                                <span className="price"><em>22,000</em>원</span>
                            </li>
                            <li className="item-inner d-inline-block text-cetner">
                                <button type="submit" className="btn btn-primary">전체구매</button>
                            </li>
                        </ul>
                    </div>
                    {/* 합산금액 끝  */}
                </div>

            </>
        )

}

export default CartList