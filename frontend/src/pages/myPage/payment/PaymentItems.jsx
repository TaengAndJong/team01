import React, {useEffect, useState} from "react";


const PaymentItems = ({paymentInfo}) =>{


    const [data,setData]=useState([]);
    console.log("PaymentItems paymentInfo", paymentInfo);

    const handleCancel = () =>{
        console.log("Cancel");
    }

    console.log("data Array ,",Array.isArray(data));
    console.log("data  ,",data);
    useEffect(()=>{
        //
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
                                <h6 className="title my-3">{payment.payDate} 결제내역</h6>
                                <table key={i} className="table table-bordered table-hover align-middle text-center mb-5">
                                    <thead className="table-light">
                                    <tr>
                                        <th scope="col">이미지</th>
                                        <th scope="col">상품정보</th>
                                        <th scope="col">배송지</th>
                                        <th scope="col">가격</th>
                                        <th scope="col">결제방식</th>
                                        <th scope="col">결제상태</th>
                                        <th scope="col">결제일시</th>
                                        <th scope="col">결제관리</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {payment.books?.map((book, index) => (
                                        <tr key={index}>
                                            <td>
                                                <img
                                                    src={book.bookImgList[0] || "/default.png"}
                                                    alt={book.bookName || "도서 이미지"}
                                                    style={{ width: "80px", height: "auto" }}
                                                />
                                            </td>
                                            <td>{book.bookName}/{book.author}</td>
                                            <td>{payment.address?.addrType}</td>
                                            <td>{book.bookPrice.toLocaleString()} 원</td>
                                            <td>{payment.payMethod === "card" ? "카드" : "계좌이체"}</td>
                                            <td>{payment.payStatus === "COMPLETED" ? "결제완료" : "결제취소"}</td>
                                            <td>{payment.payDate}</td>
                                            <td>
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