import React, {useEffect, useState} from "react";
import {formatToDate} from "../../../util/dateUtils.jsx";
import CancelPaymentBtn from "./CancelPaymentBtn.jsx";
import AddCartBtn from "./addCartBtn.jsx";



const PaymentItems = ({paymentProps}) =>{
    console.log("paymentProps----",paymentProps);
    const {paymentInfo,setPaymetInfo} = paymentProps;
    const [data,setData]=useState([]);



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
                                    <div className="resultAccount mt-2 mb-5">
                                        누적합산
                                        <button className="btn btn-light">
                                           전체 결제취소
                                        </button>
                                    </div>
                                </div>
                            ))}

                    </div>

            </div>
        </>
    )
}

export default PaymentItems