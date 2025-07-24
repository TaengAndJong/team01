import React, {useEffect, useState} from "react";
import {formatToDate} from "../../../util/dateUtils.jsx";
import CancerPaymentBtn from "./CancerPaymentBtn.jsx";


const PaymentItems = ({paymentProps}) =>{
    console.log("paymentProps",paymentProps);
    const { paymentInfo, selected, setSelected, handleCancel } = paymentProps;
    const [data,setData]=useState([]);

    //전체선택 핸들러
    const selectedAll = (payId,checked) =>{
            console.log("payId - 해당 테이블의 ",payId);
            console.log("checked",checked);
            console.log("data",data);

            //checked가 true가 되면
            if(checked){
                console.log("checked",checked);
                //전체 데이터의 payId에 해당하는 데이터만 필터
                const paytable  = data.filter(paytable => paytable.payId === payId)//
                console.log("paytable data",paytable);
                const bookIds = [];
                // es6버전을 사용할 경우 forEach로 전부 사용해야 함. es6는 Map 함수 사용가능. flat 함수는 es2019+ 호환이 안될 수 있음
                paytable.map(payment =>{
                    console.log("payment",payment);
                    console.log("books",payment.books);
                    payment.books.map((book) =>{
                        bookIds.push(book.bookId);
                    })
                });

                console.log("bookIds",bookIds);
                //payId에 속한 bookId들을 전부  배열에 추가해야함
                setSelected({
                    ...selected, // 다른테이블의 값들
                   [payId]: bookIds //해당 payId 테이블의 모든 책들을 값으로 담아줘야함
                })

            }else{
                // checked가 false 일 경우
                console.log("checked false");
                console.log("selected------------------false",selected);
                setSelected(prev => {
                    const prevBookIds = []; // 전체해제했으니까 빈 배열을 초기값으로 지정
                   // 이전 객체의 값들의 초기값 설정
                    if (prevBookIds.length === 0) { // 전체해제되었을때 
                        const {[payId]: _, ...rest} = prev; // 구조분해할당을 통해 빈 배열 객체와 아닌 객체분리
                        return rest; // setSelected의 값으로 반환
                    }else{
                        //payId 객체의 값들이 존재할경우
                        return {
                            ...prev,
                            [payId]:prevBookIds
                        }
                    }

                })
               //end
            }
    }

    //개별선택 핸들러
    const selectedOne = (payId,bookId,checked) =>{
        //payId와 bookId가 필요하고 , payId의 키로 bookIds 배열 객체를 받는 구조
        /*
        * {
        *   payId : [ bookId,bookId ],
        *   payId2 : [bookId, bookId]
        * }
        *
        * */

        //selected.key === payId 이면 기존 객체의 값이 추가 하는 로직
        console.log("selected.key",Object.keys(selected)); // selected의 keys를 조회하면 객체의 값을 보여줌
        //checked가 true 일경우와 아닐경우
        if(checked){
            //selected 가 비어있는 객체이면
            if(Object.keys(selected).length===0){
                //selected가 비어있으면
                setSelected(prev => ({
                    ...prev,
                    [payId]:[bookId],
                }));
                console.log("selected--------------------111111",selected);
            }else{
                //selected가 채워져있으면
                setSelected(prev => {
                    const prevBookIds = prev[payId] ||[]; // 초기값 또는 담겨져 있는 bookIds
                    return {
                        ...prev,
                        [payId]:[...prevBookIds,bookId],
                    }
                })
            }
        }else{
            // unchecked 하면 해당 bookId가 값으로 전달 됨
            //checked가 false일 경우(해제)
            setSelected(prev => {
                const prevBookIds = prev[payId] ||[];
                //체크해제된 Id를 제외한 나머지 필터 ==> prevBookId와 bookId와 같지 않은 bookId만 배열로 반환
                const bookIdsFiltered = prevBookIds.filter(prevBookId => prevBookId !== bookId);
                //bookIdsFiltered의 배열에 담긴 객체가 0 개일 경우 payId 삭제
                if (bookIdsFiltered.length === 0) {
                    //bookIdsFiltered 배열의 값이 0개일 때,
                    //prev에 담겨진 값들을 구조분해 할당하고
                    //배열의 값이 0개인 payId의 값을 _ (언더바) 처리하여 무시하고 나머지 값이 있는 payId들을 반환
                    const { [payId]: _, ...rest } = prev;
                    return rest; // setSelected의 값으로 반환
                }
                //아니면 이 값으로 반환
               return{
                   ...prev,
                   [payId]:bookIdsFiltered,
               }

            })
            //end
        }
    //end
    }

    console.log("selected------------------33333333",selected);

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

                            {data.map((payment, i) => (
                                <div className="table-responsive" key={i}>
                                    <h6 className="title my-3">{`No.${payment.payId} ${formatToDate(payment.payDate)} 결제내역`}</h6>
                                    <table
                                           className="table table-bordered table-hover align-middle text-center mb-5">
                                        <thead className="table-light">
                                        <tr>
                                            <th scope="col" className="text-center">
                                                {/*개수 비교에서 초기값을 0으로 대체하면 결국 두 조건이 만족이 안되기 때문에 false반환
                                                   undefined , uncontrolled input 방지
                                                */}

                                                <input type="checkbox" id="selectAll"
                                                       checked={(selected[payment.payId]?.length || 0) === payment.books?.length}
                                                       onChange={(e) => {
                                                           selectedAll(`${payment.payId}`,e.target.checked);
                                                       }}
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
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {payment.books?.map((book, index) => (
                                            <tr key={index}>
                                                <td className="text-center">
                                                    <input
                                                        type="checkbox"
                                                        id={`book${index}`}
                                                        name={`book${index}`}
                                                        checked={!!selected[payment.payId]?.includes(book.bookId)} // 상태 기반 체크 여부 결정
                                                        onChange={(e) => selectedOne(`${payment.payId}`, `${book.bookId}`, e.target.checked)}
                                                    />
                                                    <label htmlFor={`book${index}`}
                                                           className="sr-only">{`${book.bookName}`}</label>
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
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>

                                </div>
                            ))}

                </div>
                <CancerPaymentBtn handleCancel={handleCancel}/>
            </div>
        </>
    )
}

export default PaymentItems