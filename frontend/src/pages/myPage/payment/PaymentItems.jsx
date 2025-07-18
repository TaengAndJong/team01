import React, {useEffect, useState} from "react";
import {formatToDate} from "../../../util/dateUtils.jsx";


const PaymentItems = ({paymentProps}) =>{

    const { paymentInfo, selected, setSelected, handleCancel } = paymentProps;
    const [data,setData]=useState([]);

    //전체선택 핸들러
    const selectedAll = () =>{

    }
    //개별선택 핸들러
    const selectedOne = () =>{
        //payId와 bookId가 필요하고 , payId의 키로 bookIds 배열 객체를 받는 구조
    }



    useEffect(()=>{

        if (paymentInfo) {
            const changeArray = Array.isArray(paymentInfo)
                ? paymentInfo
                : [paymentInfo];
            setData(changeArray);
        }
    },[paymentInfo]); //paymentInfo가 변할 때




    return (
        <>
            <div className="paymentList">
                <h2 className="title-border title">결제 상세 정보</h2>
                <div className="border border-dark-subtle p-4  rounded-1  bg-white bg-opacity-50">
                    <div className="table-responsive">
                        {data.map((payment, i) => (
                            <>
                                <h6 className="title my-3">{`No.${payment.payId} ${formatToDate(payment.payDate)} 결제내역`}</h6>
                                <table key={i} className="table table-bordered table-hover align-middle text-center mb-5">
                                    <thead className="table-light">
                                    <tr>
                                        <th scope="col" className="text-center">
                                            <input type="checkbox" id="selectAll"
                                                //checked={}
                                                //onChange={}
                                            />
                                            <label htmlFor="selectAll" className="sr-only">전체 선택</label>
                                        </th>
                                        <th scope="col" className="text-center">이미지</th>
                                        <th scope="col" className="text-center">상품정보</th>
                                        <th scope="col" className="text-center">배송지</th>
                                        <th scope="col" className="text-center">가격</th>
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
                                                <input
                                                    type="checkbox"
                                                    id={`item${index}`}
                                                    name={`item${index}`}
                                                    //checked={checkedInput.includes(item.bookId)} // 상태 기반 체크 여부 결정
                                                   // onChange={(e) => onChangeCheck(`${item.bookId}`, e.target.checked)}
                                                />
                                                <label htmlFor={`item${index}`} className="sr-only">{`${book.bookName}`}</label>
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
                                            <td className="text-center">{payment.payMethod === "card" ? "카드" : "계좌이체"}</td>
                                            <td className="text-center">{payment.payStatus === "COMPLETED" ? "결제완료" : "결제취소"}</td>
                                            <td className="text-center">{payment.payDate}</td>
                                            <td className="text-center">
                                                {payment.payStatus === "COMPLETED" && (
                                                    <button className="btn btn-danger" onClick={handleCancel}>
                                                        결제 취소
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </>
                        ))}


                    </div>
                </div>
            </div>
        </>
    )
}

export default PaymentItems