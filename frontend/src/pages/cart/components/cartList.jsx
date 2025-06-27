import "@assets/css/cart/cartList.css"
import {useContext, useEffect, useState} from "react";
import {CartStateContext} from "../cartComponent.jsx";
import CartAddress from "./cartAddress.jsx";
import CartAccount from "./cartAccount.jsx";


const CartList = () => {
        // cartData 에서 bookList 만
        const cartData = useContext(CartStateContext);
        console.log("컴포넌트 렌더링 - cartData:", cartData);
        // 구조분해 할당을 통한 bookList ==> 구조분해 할당 시,cartdata에 담긴 키명 그대로 받아야함
        const {bookList, address} = cartData?.[0] || [];

        // 삭제 , 갱신 등의 데이터 조작이 필요한 경우 상태관리 변수 사용
        const [cartList, setCartList] = useState(null);

        //cartData가 변화할 때마다 데이터 갱신
        useEffect(() => {
            if (cartData) {
                setCartList(bookList);
            }
        },[cartData])



        //장바구니 데이터가 빈 배열(빈 값)일 경우 UI반환 함수
        const emptyCartList = () => {
            return (
                <ul className="cart-list">
                    <li className="cart-item mb-2">
                        장바구니에 담긴 상품이 없습니다.
                        도서 담으러 가기
                    </li>
                </ul>
            )
        }

    const addCartList = (cartList) => {

        return (
      <>
          {/*label 내부에 input 기입 시, htmlFor 기입 불필요*/}
          <div className="d-flex justify-content-between align-items-center mb-4">
              <label className="">
                  <input type="checkbox" name="check-all" aria-label="전체 선택"/>
                  전체선택
              </label>
              <button aria-label="삭제하기" className="cart btn btn-danger">삭제하기</button>
          </div>

          <ul className="cart-list">
              {cartList?.map((item,index) => (
                  <li key={index} className="cart-item mb-2">
                      <div className="item-inner d-flex card flex-row default-border position-relative p-4 mb-2 ">
                          <label className="position-absolute check-one" htmlFor={`check0${index+1}`}>
                              <input type="checkbox" id={`check0${index+1}`}>
                              </input>선택삭제</label>
                          <div className="card-header border-end rounded-4 overflow-hidden">
                              <div className="img-box">
                                  <div className="img-inner">
                                      <img className="img" src={`${item.bookVO.bookImgList[0]}`} alt="노이미지"/>
                                  </div>
                              </div>
                          </div>
                          {/* 도서 정보*/}
                          <div className="bookInfo card-body">
                              <strong className="book-title title-dotted d-block">{item.bookVO.bookName}</strong>
                              <ul className="ul bullet">
                                  <li className="li"><span className="tit">저자</span>{item.bookVO.author}</li>
                                  <li className="li"><span className="tit">발행일</span>{item.bookVO.publishDate}</li>
                                  <li className="li"><span className="tit">가격</span><em>{item.bookVO.bookPrice}</em>원</li>

                              </ul>
                              {/* 도서 가격 */}
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
                                      <button type="submit" aria-label="구매하기"
                                              className="submit btn btn-secondary">선택도서구매
                                      </button>
                                  </li>
                              </ul>
                              {/* 도서 */}
                          </div>
                      </div>

                  </li>
              ))}

          </ul>

      </>
        )
    }
        console.log("addrCartlist --- cartList",address);
    return (
        <>
            <div className="cart d-block clearfix">
                <h3 className="title-border title">장바구니</h3>

                {/*배송지 선택  title-dotted , 객체 중첩구조 단순화하여 props넘기기*/}
                <CartAddress addrList={address}/>

                {/* cartList  */}
                {cartData && cartData.length > 0 ? addCartList(bookList) : emptyCartList()}

                {/* cartAccount */}
                <CartAccount />
            </div>
        </>
    )

}

export default CartList