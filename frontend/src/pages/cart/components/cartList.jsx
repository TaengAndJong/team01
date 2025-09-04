import "@assets/css/cart/cartList.css"
import React, { useContext, useEffect, useState} from "react";
import {CartDispatchContext, CartStateContext} from "../cartComponent.jsx";
import CartAddress from "./cartAddress.jsx";
import axios from "axios";
import CartItemPrice from "./cartItemPrice.jsx";
import CartAllPrice from "./cartAllPrice.jsx";
import {Link, useNavigate} from "react-router-dom";
import ReusableModal from "./modal.jsx";



const CartList = () => {
        // cartData 에서 bookList 만
        const cartData = useContext(CartStateContext);
        console.log("컴포넌트 렌더링 - cartData:", cartData);
        const {onInit} = useContext(CartDispatchContext);


        //로딩 상태관리
        const [loading, setLoading] = useState(false);

        //모달 상태관리
        const [show, setShow] = useState(false);
        const [errorData, setErrorData] = useState({});
        const handleClose = () => {
            console.log("close modal");
            setShow(false)}
        const [modalType, setModalType] = useState("confirm");


    // 구조분해 할당을 통한 bookList ==> 구조분해 할당 시,cartdata에 담긴 키명 그대로 받아야함
        const {bookList, address} = cartData?.[0] || [];
        // 삭제 , 갱신 등의 데이터 조작이 필요한 경우 상태관리 변수 사용 
        // ==> 전역데이터를 한 번더 담아주는 이유는 초기 렌더링 시 null, undefined 방지
        //전역상태 데이터를 바로 사용하면 리렌더링될 때마다 갱신발생, UI상태관리가 힘들어짐
        const [cartList, setCartList] = useState(null);

        //목록선택 개별상태관리변수
        const [selectItem, setSelectItem] = useState([]);
        //페이지 이동
        const navigate= useNavigate();

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

        //총 가격 공통 메서드
        const totalPrice = (cartList,cartIds) =>{
            console.log("totalPrice----cartList",cartList);
            const selectedItems = cartList?.filter(item => cartIds.includes(item.cartId));
            console.log("totalPrice----selectedItems",selectedItems);
            let total = 0;
            for (let i = 0; i < selectedItems?.length; i++) {
                total += (selectedItems[i].book.bookPrice * selectedItems[i].book.quantity);
            console.log("for total ",total);
            }
            console.log("acc total ",total);
            return total;
        }
        //결제 핸들러
        const gotoPayment=(cartList,cartIds)=>{
            console.log("payment gotoPayment");
            const total = totalPrice(cartList,cartIds);
            console.log("gotoPayment-----total",total);
            //여기에서  가격 검증해야하나
            if(total === 0 || total === null){
                console.log("결제할 상품이 없다")
                setShow(true);
                setErrorData({
                    message:"결제할 상품이 없습니다",
                })
            }else{
                //결제페이지로 이동할 때 필요한 파라미터 navigate객체에 담아서 보내주기
                console.log("결제페이지로 이동");
                console.log("cartIds",cartIds);
                navigate("/payment",{
                    state:{
                        cartIds,
                        payAccount :total,
                        addrId: address?.addrId,
                    }
                });
            }
            //end
        }
        //gotoPayment End

    //cartData가 변화할 때마다 데이터 갱신
        useEffect(() => {
            console.log("CartData---------------useEffect--cartList",cartData);
            if (cartData) {
                setCartList(bookList);
            }
        },[cartData])




        console.log("CartData----cartList",cartList);

        //장바구니에 도서 담길 때 전체 선택 자동으로 될 경우
        useEffect(() => {
            //carList가 null인지 undefined인지 확인 후 빈 배열 확인
            if(cartList && cartList.length > 0){
                const allId = cartList.map(item => item.cartId);
                //선택 상태관리 변수 갱신
                setSelectItem(allId);
            }else{
                setSelectItem([]);// 없으면 빈배열
            }
        },[cartList]) // cartList 가 변경될 때마다 실행

        //장바구니 데이터가 빈 배열(빈 값)일 경우 UI반환 함수
        const emptyCartList = () => {
            return (
                <ul className="cart-list">
                    <li className="cart-item mb-2 text-center">
                        <p>장바구니에 담긴 상품이 없습니다.</p>
                        <Link to="/book" className={"btn btn-secondary"}>도서보러가기</Link>
                    </li>
                </ul>
            )
        }

        const addCartList = (cartList) => {
            console.log("addCartList-----bookList", cartList); // undefined여서 에러나는데
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
                          <div className="item-inner d-flex card flex-row default-border position-relative">
                              <label className="position-absolute check-one" htmlFor={`check0${index+1}`}>
                                  <input type="checkbox" id={`check0${index+1}`}
                                         checked={selectItem.includes(item.cartId)}
                                         onChange={(e)=>{selectOneHandler(item.cartId,e.target.checked)}}>
                                  </input>선택삭제
                              </label>
                              <div className="card-header border-end rounded-4 overflow-hidden">
                                  <div className="img-box">
                                      <div className="img-inner">
                                          <img className="img" src={`${item.book.bookImgList[0]}`} alt="노이미지"/>
                                      </div>
                                  </div>
                              </div>
                              {/* 도서 정보*/}
                              <div className="bookInfo card-body">
                                  <strong className="book-title title-dotted d-block">{item.book.bookName}</strong>
                                  <ul className="ul bullet">
                                      <li className="li"><span className="tit">저자</span>{item.book.author}</li>
                                      <li className="li"><span className="tit">발행일</span>{item.book.publishDate}</li>
                                      <li className="li"><span className="tit">가격</span><em>{item.book.bookPrice}</em>원</li>

                                  </ul>
                                  {/* 도서 가격  도서가격, 도서수량 */}
                                  <CartItemPrice cartList={item}
                                                  deliveryFee={2000}
                                                  gotoPayment={() => gotoPayment(cartList,item.cartId)}
                                  />

                              </div>
                          </div>

                      </li>
                  ))}

              </ul>

          </>
            )
        }


    return (
        <>
            <div className="cart d-block clearfix">
                <h3 className="title-border title">장바구니</h3>

                {/*배송지 선택  title-dotted , 객체 중첩구조 단순화하여 props넘기기*/}
                <CartAddress addrList={address}/>

                {/* cartList -- cartData의 bookList값이 있을 때 없을때  */}
                {cartList && cartList?.length > 0 ? addCartList(cartList) : emptyCartList()}

                {/* cartAccount */}
                <CartAllPrice cartList={cartList} selectItem={selectItem} deliveryFee={2000} gotoPayment={gotoPayment}
                              totalPrice={totalPrice}
                />
            </div>

            {loading && (
                <div className="loading-overlay"
                     style={{
                         position: "fixed",
                         top: 0,
                         left: 0,
                         width: "100vw",
                         height: "100vh",
                         background: "rgba(255,255,255,0.8)",
                         display: "flex",
                         justifyContent: "center",
                         alignItems: "center",
                         zIndex: 9999,
                         flexDirection: "column"
                     }}
                >
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3">결제 진행중입니다. 잠시만 기다려 주세요.</p>
                </div>
            )}

            {/* 알림모달 */}
            {show && (
                <ReusableModal show={show}
                               onClose={handleClose}
                               errorData={errorData}
                               modalType="error"/>
            )}

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