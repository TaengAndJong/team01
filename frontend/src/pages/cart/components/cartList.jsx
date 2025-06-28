import "@assets/css/cart/cartList.css"
import {useCallback, useContext, useEffect, useState} from "react";
import {CartDispatchContext, CartStateContext} from "../cartComponent.jsx";
import CartAddress from "./cartAddress.jsx";
import CartAccount from "./cartAccount.jsx";
import axios from "axios";
import error from "eslint-plugin-react/lib/util/error.js";


const CartList = () => {
        // cartData 에서 bookList 만
        const cartData = useContext(CartStateContext);
        console.log("컴포넌트 렌더링 - cartData:", cartData);
        const {onInit} = useContext(CartDispatchContext);

        // 구조분해 할당을 통한 bookList ==> 구조분해 할당 시,cartdata에 담긴 키명 그대로 받아야함
        const {bookList, address} = cartData?.[0] || [];
        // 삭제 , 갱신 등의 데이터 조작이 필요한 경우 상태관리 변수 사용
        const [cartList, setCartList] = useState(null);

        //목록선택 개별상태관리변수
        const [selectItem, setSelectItem] = useState([]);


        //개별선택 핸들러
        const selectOneHandler = (cartId,checked)=>{
            console.log("selectOne-- 개별선택", cartId);
            console.log("selectOne-- checked", checked);
            //checked가 true 이면
            if(checked){
                console.log("선택 true");
                //배열로 선택된 아이디 장바구니아이템 담기
                setSelectItem((prev)=>[
                    ...prev, // 배열이 담긴 cartId
                    cartId, // 새로 선택된 cartId
                ]);
            }else{
                console.log("선택 false");
                //체크가 해제된 cartId를 제외하고 배열에 반환(필터링)
                setSelectItem((prev)=> prev.filter(item => item !== cartId)) // filter 함수는 배열로 값 반환
            }
        }


        //전체선택 핸들러
        const selectAllHandler = (checkedAll)=>{
            console.log("selectAll-- 전체선택", checkedAll);
            console.log("selectAll-- selectItem", selectItem);
            // 이미 담긴 아이디는 담지 않는다 ==> 필터링
            if(checkedAll){ //전체선택 checked가 true이면
                //모든 도서 체크박스 체크드 true 해야되는데 어떻게 접근해 ?

                //cartList의 모든 아이디 순회하고
                //selectItem에 이미 담긴 아이디는 제외한 Id 담기
                const filterSelectIds= cartList.map((item)=> item.cartId) // cartList의 item의 cartId를  map 함수로 배열로 반환 후
                    .filter(id => id !== selectItem.includes(id)); // 개별선택으로 배열에 담긴 아이디와 동일하지 않은 Id만 필터링해서 반환
                console.log("filterSelectIds", filterSelectIds);
                //selectItem에 데이터 갱신
                setSelectItem(filterSelectIds);
            }else{
                setSelectItem([]); // 빈 배열 리셋
            }
        }
         console.log("selectItem----------Last",selectItem);

        //장바구이 아이템 삭제 handler
        const deleteItemHandler = async ()=>{
            console.log("장바구니 아이템 삭제 비동기요청 핸들러");
            console.log("selectItem----------Last",selectItem);

            try{
                //axios로 비동기 요청 보내기
                const response = await axios.delete("/api/cart/delete",{
                    data:selectItem //body에 데이터 담기
                })
                // axios는 response.ok 없음 → HTTP 에러는 catch에서 잡힘
                console.log("응답성공 클라이언트로 보내진 데이터",response.data);
                //cartList 데이터 갱신필요
                const bookList =  response.data.bookList
                // axios는 response.data를 json으로 파싱해서 promise가 아니므로 await 사용할 필요 없음
                onInit(bookList);// 전역 데이터 갱신
                setSelectItem([]);// 삭제선택된 배열 리셋
            }catch(error){
                console.error("삭제 실패:", error);
                // 에러 처리 로직 작성 (알림, 재시도 등)
            }
            
        }


        //cartData가 변화할 때마다 데이터 갱신
        useEffect(() => {
            console.log("CartData---------------useEffect--cartList",cartData);
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
                      <input type="checkbox" name="check-all" aria-label="전체 선택"
                             checked={selectItem.length === cartList.length && cartList.length > 0}
                             onChange={(e)=>{selectAllHandler(e.target.checked)}}/>
                      전체선택
                  </label>
                  <button aria-label="삭제하기" className="cart btn btn-danger" onClick={deleteItemHandler}>삭제하기</button>
              </div>

              <ul className="cart-list">
                  {cartList?.map((item,index) => (
                      <li key={index} className="cart-item mb-2">
                          <div className="item-inner d-flex card flex-row default-border position-relative p-4 mb-2 ">
                              <label className="position-absolute check-one" htmlFor={`check0${index+1}`}>
                                  <input type="checkbox" id={`check0${index+1}`}
                                         checked={selectItem.includes(item.cartId)}
                                         onChange={(e)=>{selectOneHandler(item.cartId,e.target.checked)}}>
                                  </input>선택삭제
                              </label>
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
                                          <span className="me-4">상품금액</span>
                                          <span className="price"><em>{item.bookVO.bookPrice}</em>원</span>
                                          <span className="mx-4">수량</span>
                                          <span className="price"><em>{item.quantity}</em></span>
                                      </li>

                                      <li className="li d-inline-flex align-items-center px-3">
                                          <span className="me-4">배송금액</span>
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

/*
*  <label className="">
      <input type="checkbox" name="check-all" aria-label="전체 선택"
             checked={selectItem.length === cartList.length && cartList.length > 0}
             onChange={(e)=>{selectAllHandler(e.target.checked)}}/>
      전체선택
  </label>
  * 
  * cartList.length > 0 조건을 주어야 하는 이유는 cartList.length  === 0 일 때 true 상태를 방지하기 위해서
*
* */