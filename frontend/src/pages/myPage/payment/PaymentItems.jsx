import React, {useEffect, useState} from "react";
import {formatToDate} from "../../../util/dateUtils.jsx";
import CancerPaymentBtn from "./CancerPaymentBtn.jsx";
import axios from "axios";


const PaymentItems = ({paymentProps}) =>{
    console.log("paymentProps",paymentProps);
    const { paymentInfo} = paymentProps;
    const [data,setData]=useState([]);

    const handleCancel = async(bookId,payId) =>{
        console.log("handleCancel---",`bookId:${bookId} && payId : ${payId}`);
        //컨트롤러로 전달할 필수 데이터는 payId와 payId에 해당하는 bookId들
        const params = {
            payId: payId,
            bookId: bookId,
        }
        //결제취소 컨트롤러로 비동기 요청보내기
        try{
            const response = await axios.post("/api/mypage/payCancel",params);
            const recievedData = response.data;
            console.log("recievedData",recievedData);
            //결제 취소처리 데이터를 받으면, 최종 paymentInfo가 갱신이 되고, 리렌더링 되어야함 => useEffect 처리해야하는가?
            //setPaymetInfo(recievedData);
        }catch(e){
            //에러처리 어떻게 해야 돼 ?
            console.error(e);
        }

    }




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
            case "PARTIAL": return "부분취소";
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
                                           className="table table-bordered table-hover align-middle text-center mb-5">
                                        <thead className="table-light">
                                        <tr>
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
                                                <td className="text-center">{payStatusText(payment.partPayStatus)}</td>
                                                <td className="text-center">{payment.payDate}</td>
                                                <td className="text-center"> <CancerPaymentBtn handleCancel={() => handleCancel(book.bookId, payment.payId)}/></td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>

                                </div>
                            ))}

                </div>

            </div>
        </>
    )
}

export default PaymentItems