import React from "react";


const SelectPayment = ({paymentInfo,setPaymentInfo}) =>{
    console.log("paymentInfo-------------",paymentInfo)
    //라디오 버튼 선택 시 결제방법 상태 업데이트 onchange() 핸들러
    const onChangePayMethod =(e)=>{
      //
        console.log("onChangePayMethod e.target.value",e.target.value);
        const paymentMethod = e.target.value;
        setPaymentInfo(prev => ({
            ...prev,
            paymentMethod: paymentMethod,
            cardName: paymentMethod === "card" ? prev.cardName : "",
            cardNumber: paymentMethod === "card" ? prev.cardNumber : "",
            bankName: paymentMethod === "bank" ? prev.bankName : "",
            bankAccount: paymentMethod === "bank" ? prev.bankAccount : "",
        }));
    }

    // 카드/계좌 정보 input 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log("name---------",name);
        console.log(" value--------", value);
        setPaymentInfo((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    return (
        <>
            <fieldset>
                <legend className="title my-3">결제 수단 선택</legend>
                <ul className="border border-dark-subtle p-4 bg-white bg-opacity-50 rounded-1">
                    <li className="mb-3">

                            <input type="radio" id="card" name="paymentMethod" value="card"
                                   checked={paymentInfo.paymentMethod === 'card'}
                                   onChange={onChangePayMethod}/>
                            <label htmlFor="card" className="title mx-2 my-2">신용/체크카드</label>

                        {/* 신용카드 체크하면 */}
                        {paymentInfo.paymentMethod === 'card' && (
                            <div className="">
                                <div className="me-2 d-inline-flex align-items-center">
                                    <label htmlFor="bankName" className="title ms-4 me-3">카드사 선택</label>
                                    <select
                                        id="bankName"
                                        className="form-select w-auto"
                                        name="bankName"
                                        value={paymentInfo.cardName}
                                        onChange={handleChange}
                                    >
                                        <option value="">카드사선택</option>
                                        <option value="KB">국민</option>
                                        <option value="SH">신한</option>
                                        <option value="NH">농협</option>
                                    </select>
                                </div>
                                <div className="d-inline-flex align-items-center">
                                    <label htmlFor="cardNumber" className="title ms-4 me-3">카드번호</label>
                                    <input
                                        type="text"
                                        id="cardNumber"
                                        className="form-control"
                                        name="cardNumber"
                                        value={paymentInfo.cardNumber}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="d-inline-flex align-items-center">
                                    <button type="button" className="ms-2 btn btn-primary">확인</button>
                                </div>
                            </div>
                        )}
                    </li>
                    <li>
                        <input type="radio" id="bank" name="paymentMethod" value="bank"
                               checked={paymentInfo.paymentMethod === 'bank'}
                               onChange={onChangePayMethod}/>
                        <label htmlFor="card" className="title mx-2 my-2">계좌이체</label>
                        {/* 계좌이체 체크하면 */}
                        {paymentInfo.paymentMethod === 'bank' && (
                            <div className="">
                                <div className="me-2 d-inline-flex align-items-center">
                                    <label htmlFor="bankName" className="title ms-4 me-3">은행 선택</label>
                                    <select
                                        id="bankName"
                                        className="form-select w-auto"
                                        name="bankName"
                                        value={paymentInfo.bankName}
                                        onChange={handleChange}
                                    >
                                        <option value="">은행 선택</option>
                                        <option value="KB">국민은행</option>
                                        <option value="SH">신한은행</option>
                                        <option value="NH">농협은행</option>
                                        {/* 필요한 은행들 추가 */}
                                    </select>
                                </div>
                                <div className="d-inline-flex align-items-center">
                                    <label htmlFor="bankAccount" className="title ms-4 me-3">계좌번호</label>
                                    <input
                                        type="text"
                                        id="bankAccount"
                                        className="form-control"
                                        name="bankAccount"
                                        value={paymentInfo.bankAccount}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="d-inline-flex align-items-center">
                                    <button type="button" className="ms-2 btn btn-primary">확인</button>
                                </div>
                            </div>
                        )}
                    </li>
                </ul>
            </fieldset>
        </>
    )
}

export default SelectPayment