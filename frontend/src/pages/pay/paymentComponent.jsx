import { useLocation, useNavigate } from "react-router-dom";
import React, {useEffect, useMemo, useState} from "react";
import axios from "axios";
import "@assets/css/payment.css";
import PayItem from "./components/payItem.jsx";
import SelectPayment from "./components/selectPayment.jsx";
import PayAllPrice from "./components/payAllPrice.jsx";
import validationPay from "../../util/validationPay.jsx";
import {useModal} from "../common/modal/ModalContext.jsx";
import {catchError} from "../../util/error.jsx";
import {getAllPrice, getDeliveryPrice} from "../../util/calculatePrice.js";

const PaymentComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  console.log("location----", location?.state);
  // location에 담겨온 state 객체들 구조분해할당
  const {  book, type, cartIds,cartId } = location?.state;
  //공통모달
   const {openModal, closeModal} = useModal();

  //주소 상태관리 ==> 단일 객체로 넘어오면 null이 나을까 {}가 나을까?
  const [address, setAddress] = useState(null);
  //주문도서정보관리 ==> 배열로 넘어오니까 null 이 나을까 [] (빈배열이) 나을까..?
  const [books, setBooks] = useState([]);
  // 결제방식 선택 상태관리
  const [paymentInfo, setPaymentInfo] = useState({
    payMethod: "card",
    cardName: "",
    cardNumber: "",
    bankName: "",
    bankAccount: "",
    payAccount: "",
    addrId: "",
    cartIds: cartIds || [cartId], //전체구매일 경우는 cartIds 는 배열, 단건구매일경우 cartId는 문자열로 배열로 감싸서 넘겨야 에러안남
    payConfirm: "false",
  });


  const [confirmData, setConfirmData] = useState({});


  //1.필요한 데이터는 books의 도서들 가격 의 총합 + 배송비
  // 2.결제버튼 누르면 paymentInfo 서버로 submit할 핸들러 함수
  //reduce는 배열을 순회하면서 각 요소의 값을 누적하여 반환하는 함수로,
  //accPrice의 초기값은 0을 지정하고 item의 계산값을 누적하여 반환
  // null 병합 연산자로 값이 null이면 0을 대체해서 에러 방지

  //전체 상품가격 계산
  const allPrice = useMemo(() => {
    return getAllPrice(books);
  }, [books]);
  //배송비 계산

  const deliveryPrice = useMemo(()=>{
    return getDeliveryPrice(allPrice);
  },[allPrice])

  // 결제컨트롤러로 보낼 비동기요청
  const submitPaymentHandler = async (paymentInfo) => {
    console.log("submitPaymentHandler", paymentInfo);

    try {
      const response = await axios.post("/api/payment", paymentInfo);
      console.log("response--------------------------", response);
      //paySuccess 페이지로 payId 담아서 페이지 이동시키기 ==> location 말고 URLparams 로 사용해야 새로고침해도 사라지지않음
      const payId = response.data.payId;
      console.log("payId", payId);
      //서버로부터 받아오느 payId를 가지고 결제성공 페이지로 이동
      navigate(`/mypage/payHistory`);
    } catch (err) {
      console.log(err);
      console.log("error 결제 정보 서버로 전송후 에러 처리", err);
      catchError(err,{openModal,closeModal,navigate});
    }
  };
  //결제버튼 onClick 이벤트핸들러
  const onClickPayment = async (e) => {
    //form submit 발생 방지
    e.preventDefault();
    //paymentInfo의 현재값 유지, payAccount만 바꿈
    // ==> setPaymentInfo를 바로사용하면 리렌더링이 안될 수 있음
    // 원본 객체를 안전하게 유지할 수 있는 참조객체를 만들어서 값을 변경해줘야 함
    const updatedPaymentInfo = {
      ...paymentInfo,
      payAccount: allPrice,
      addrId: address?.addrId, // 요기에서 addrId 와 bookList의 값을 지정해줘야 서버로 넘어감
      bookList: books?.map((item) => ({
        bookId: item.book.bookId,
        quantity: item.book.quantity,
      })),
    };

     console.log("updatedPaymentInfop-----onClickPayment", updatedPaymentInfo);

    //paymentInfo의 payAccount 값 담아주기
    setPaymentInfo(updatedPaymentInfo);
    //여기서 한 번더 검증 필요
    const formValid = validationPay(updatedPaymentInfo);
    console.log("페치요청 마지막 검증", formValid.valid);

    if (!formValid.valid) {
      console.log("페치요청 마지막 검증 true", formValid.valid);
      //모달띄우기
      openModal({
        modalType:"confirm",
        content:<><p><span className="fw-bold me-2 text-danger d-inline-block">결제불가</span>결제정보를 입력해주세요.</p></>,
        onConfirm: () => {closeModal()}
      });
      return; // 여기서 return 안 하면 종료가 되지않아서  서버로 계속 요청 감
    }
    console.log("paymentInfo", paymentInfo);
    //서버로 비동기 요청 보낼 함수 실행,  서버로 보내줄 파라미터 넘겨주기
    await submitPaymentHandler(updatedPaymentInfo); // 이 핸들러 끝날 때까지 기다려라! ==> async , await 사용안하면 onclick 이벤트가  먼저 끝나버림
    //갱신된 내용 반영
    setPaymentInfo(updatedPaymentInfo);
    console.log("onClick 끝");
  };

  useEffect(() => {
    // 주소는 공통으로 받아오기, 바로구매,선택구매( + 장바구니)일 조건으로 나눠주기
    
    axios
      .get("/api/payment")
      .then((response) => {

        const addr = response.data.address;
        //주소에 데이터 갱신
        setAddress(addr);
        
        // 조건 분기에따른 books 데이터 설정
        if ((type === "buyNow" ||type ==="selected" ) && book) {

          //바로구매일 때는 location.state.book만 사용, allPrice와 구조 맞춰줘야함
          setBooks([{book:book}]); // 배열로 감싸줌 (결제 페이지는 배열 기준이니까)
        } else {
          // 선택구매(장바구니)일 때는 서버에서 받아온 bookList 사용
          setBooks(response.data.bookList);
        }
        
      })
      .catch((err) => {
        console.log("error---결제정보창 에러 처리어떻게", err);
        catchError(err,{openModal,closeModal})
      });
  }, []);

  console.log("paymentComponent books ---------------",books)

  return (
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
              <h4 className="title my-3">배송지</h4>

              <div className="d-flex select-address border border-dark-subtle p-4 bg-white bg-opacity-50 rounded-1">
                {address ? (
                  <ul className="">
                    <li className="me-4 d-inline-flex align-items-center">
                      <strong className="title tultip recom me-2">분류</strong>
                      {address.addrType}
                    </li>
                    <li className="me-4 d-inline-flex align-items-center">
                      <strong className="title tultip normal me-2">우편주소</strong>
                      {address.zoneCode}
                    </li>
                    <li className="me-4 d-inline-flex align-items-center">
                      <strong className="title tultip normal me-2">주소</strong>
                      {address.addr}
                      <strong className="title tultip normal mx-4">상세주소</strong>
                      {address.detailAddr}
                    </li>
                  </ul>
                ): (
                    <div className="select-address">
                      <button aria-label="배송지 등록" className="btn btn-sm btn-primary ms-3"> 배송지 등록
                      </button>
                    </div>
                )}
              </div>


            </div>
            <form aria-labelledby="paymentForm" onSubmit={submitPaymentHandler}>
              {/*결제할 장바구니 목록*/}
              <section
                aria-labelledby="cartSectionTitle"
                className="align-items-center mb-1"
              >
                <h4 id="cartSectionTitle" className="title my-3 d-block">
                  결제할 목록
                </h4>
                {/*장바구니 결제목록과 바로결제에 따라서 books의 데이터 변경 필요*/}
                <PayItem books={books} />

              </section>
              {/* 결제 수단 선택 */}
              <SelectPayment
                paymentInfo={paymentInfo}
                setPaymentInfo={setPaymentInfo}
              />

              {/* 총 결제금액*/}
              <section className="mt-4" aria-labelledby="priceSummary">
                <h4 id="priceSummary" className="title my-3">
                  결제 금액 요약
                </h4>
                <ul className="bg-warning-subtle p-4 d-flex align-items-center">
                  <PayAllPrice deliveryPrice={deliveryPrice} allPrice={allPrice} />
                  <li className="ms-auto li">
                    <button
                      type="submit"
                      className="btn btn-danger"
                      onClick={onClickPayment}
                    >
                      결제하기
                    </button>
                  </li>
                </ul>
              </section>
            </form>
            {/*content  end*/}
          </div>
        </section>
      </div>
    </>
  );
};

export default PaymentComponent;
