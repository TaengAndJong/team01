import React, {useEffect, useState} from "react";
import {formatToDate} from "../../../util/dateUtils.jsx";
import CancelPaymentBtn from "./CancelPaymentBtn.jsx";
import AddCartBtn from "./addCartBtn.jsx";
import axios from "axios";



const PaymentItems = ({paymentProps}) =>{

    const {paymentInfo,setPaymetInfo} = paymentProps;
    const [data,setData]=useState([]);

    //테이블 당 PayId 하나의 테이블만 선택
    const [selected, setSelected] = useState({}); // {payId : [bookId1,bookId2,bookId3....]}

    // //모달 상태관리
    // const [show, setShow] = useState(false);
    // const [errorData, setErrorData] = useState({});
    // const handleClose = () => {
    //     console.log("close modal");
    //     setShow(false)}
    // const handleShow = () => {
    //     console.log("handleShow");
    //     setShow(true)}
    // const [modalType, setModalType] = useState("confirm");



    useEffect(()=>{
        if (paymentInfo) {
            const changeArray = Array.isArray(paymentInfo)
                ? paymentInfo
                : [paymentInfo];
            setData(changeArray);
        }
    },[paymentInfo]); //paymentInfo가 변할 때


    //payStatus 상태값에 따른 텍스트 출력 함수
    const payStatusText = (status) =>{
        console.log("payStatusText---------------결제상태",status);

        switch(status){
            case "COMPLETED": return "결제완료";
            case "CANCEL": return "결제취소";
            case "CANCELALL": return "전체취소";
            case "READY": return "결제대기";
            case "FAILED": return "결제실패";
            default: return "";
        }

    }

    //테이블 당 PayId 하나의 테이블의 상품 전체선택 핸들러(객체가 1개 이상이면 경고메시지 필요)
    const allSelectHandler=(payId,books,checked)=>{

    
        if(checked){ // 이벤트가 발생한 대상으로 checked조건 여부 판단하여 각 결제항목에만 check 가능
            //부모인 PayId의 자식인 bookIds만 배열로 반환 
            const bookIds = books.map(book=> book.bookId);
            console.log("bookIds---서버로 전송할 ",bookIds); // 이미 결제가 취소된 부분은 서버에서 검증을 통해 필터링하기

            // 결제내역 선택 수량 제한
            if(Object.keys(selected).length < 1){ // 객체를 직접참조하지않고 Objects.keys를 사용해 selected 객체의 key값을 복사해 참조
                //prev를 사용하는 이유는
                // 이전상태값을 기반으로 새 상태를 만드는 것으로 비동기 처리 시,
                // 현재상태값을 직접 참조하지않고 복사해서 해당 객체에만 새로운 값을 덮어씌우는 함수형 업데이트로 처리하는 게 안전하기 때문에
                setSelected(prev =>({
                    ...prev, //이전상태 복사
                    [payId]:bookIds//해당하는 항목의 새로운 값을 기본의 값에 새롭게 덮어씌움
                }))
            }else{
                console.log("selected: 하나의 결제건만 가능",selected);
                //모달 띄우기
            }

        }else{ //checked가 false이면
            setSelected(prev=>{
                const{[payId]:_,...data} = prev; // 기존의 데이터를 구조분해할당, payId의 value가 비어있으면
                return data // 나머지 데이터만 반환
            });
        }

    }

    //전체결제취소 핸들러
    const allCancelHandler= async (selected)=>{
        console.log("전체취소핸들러 클릭클릭",selected);
        const payId = Object.keys(selected)[0]; // '101'
        const bookIds = selected[payId];        // ['16', '17']

        const params = {
            payId,
            bookIds
        };

        console.log("params",params);
        try{
            // 전체취소 버튼 클릭 시 서버로 전체결제취소 데이터 전송
            const response =await axios.post("/api/mypage/payAllCancel",params); 
            console.log("response---전체선택 결제취소",response);
            const recievedData = response.data;
            console.log("recievedData----------",recievedData);
        }catch(e){
            console.log("response---전체선택 결제취소 e",e);
        }


    }



    return (
        <>
            <div className="paymentList">
                    <h2 className="title-border title">결제 상세 정보</h2>
                    <div className="border border-dark-subtle p-4  rounded-1  bg-white bg-opacity-50">

                            {data.map((payment, i) => (
                                <div className="table-responsive" key={i}>
                                    <h6 className="title my-3">{`No.${payment.payId} ${formatToDate(payment.payDate)} 결제내역`}</h6>
                                    <table
                                           className="table table-bordered table-hover align-middle text-center">
                                        <thead className="table-light">
                                        <tr>
                                            <th className="text-center">
                                                <label htmlFor="checkedAll" className="sr-only">전체 선택</label>
                                                <input id="checkedAll" type="checkbox"
                                                       name="checkBox"
                                                       checked={
                                                           Array.isArray(selected[payment.payId]) && // 배열인지 확인하면 초기값이 undefined가 되지 않게 처리 ==> true, false로 반환
                                                           selected[payment.payId].length === payment.books.length && // 선택된 payId의 bookIds객체 수량과 기존 books객체의 수량비교
                                                           payment.books.every(book => selected[payment.payId].includes(book.bookId)) //대상의 배열 요소들이 순서에 상관없이 조건에 모두 만족하는지  판단, true여야 진행
                                                       }
                                                       onChange={(e) => allSelectHandler(payment.payId,payment.books,e.target.checked)}/>
                                            </th>
                                            <th scope="col" className="text-center">이미지</th>
                                            <th scope="col" className="text-center">상품정보</th>
                                            <th scope="col" className="text-center">배송지</th>
                                            <th scope="col" className="text-center">가격</th>
                                            <th scope="col" className="text-center">수량</th>
                                            <th scope="col" className="text-center">결제방식</th>
                                            <th scope="col" className="text-center">결제상태</th>
                                            <th scope="col" className="text-center">결제일시</th>
                                            <th scope="col" className="text-center">결제관리</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {payment.books?.map((book, index) => (
                                            <tr key={index}>
                                                <td className="text-center">
                                                    <label htmlFor="checkedOne"  className="sr-only">{`도서 ${book.bookName} 선택`}</label>
                                                    <input
                                                       className="sr-only"
                                                        id="checkedOne"
                                                        type="checkbox"
                                                        name="checkBox"
                                                        checked={selected[payment.payId]?.includes(book.bookId) || false}
                                                        onChange={() => handleSelect(payment.payId, book.bookId)}
                                                    />
                                                </td>
                                                <td className="text-center">
                                                    <img
                                                        src={book.bookImgList[0] || "/default.png"}
                                                        alt={book.bookName || "도서 이미지"}
                                                        style={{width: "80px", height: "auto"}}
                                                    />
                                                </td>
                                                <td className="text-center">{book.bookName}/{book.author}</td>
                                                <td className="text-center">{payment.address?.addrType}</td>
                                                <td className="text-center">{book.bookPrice.toLocaleString()} 원</td>
                                                <td className="text-center">{book.quantity}개</td>
                                                <td className="text-center">{payment.payMethod === "card" ? "카드" : "계좌이체"}</td>
                                                <td className="text-center">{payStatusText(book.partPayStatus)}</td>
                                                <td className="text-center">{payment.payDate}</td>
                                                <td className="text-center">
                                                    {
                                                        book.partPayStatus === "COMPLETED"
                                                            ? <CancelPaymentBtn bookId={book.bookId}
                                                                                payId={payment.payId}
                                                                                setPaymetInfo={setPaymetInfo}
                                                            />
                                                            : <AddCartBtn bookId={book.bookId}
                                                                          quantity={book.quantity}/>
                                                    }
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                    {/* 총 결제 금액*/}
                                    <div className="resultAccount mt-2 mb-5 d-block">
                                        <ul className="d-flex flex-wrap justify-content-end border p-3 btn-outline-info rounded-1">
                                            <li className="mx-3 d-inline-flex align-items-center">
                                                <span className="mx-3 fw-bold">총 결제금액</span>
                                                <span>20000원</span>
                                            </li>
                                            <li>
                                                <button type="button" className="btn btn-secondary ms-auto" onClick={()=> allCancelHandler(selected)}>
                                                    전체 결제취소
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            ))}

                    </div>

            </div>
        </>
    )
}

export default PaymentItems