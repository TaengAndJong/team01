import React from "react";
import validationPay from "../../../util/validationPay.jsx";
import {useModal} from "../../common/modal/ModalContext.jsx";



const SelectPayment = ({paymentInfo,setPaymentInfo,modalState}) =>{
    console.log("paymentInfo-------------",paymentInfo)
    const {openModal,closeModal} = useModal();


    //라디오 버튼 선택 시 결제방법 상태 업데이트 onchange() 핸들러
    const onChangePayMethod =(e)=>{
      //
        console.log("onChangePayMethod e.target.value",e.target.value);
        const target = e.target.value;

        setPaymentInfo(prev => ({
            ...prev,
            payMethod: target,
            cardName: target === "card" ? prev.cardName : "",
            cardNumber: target === "card" ? prev.cardNumber : "",
            bankName: target === "bank" ? prev.bankName : "",
            bankAccount: target === "bank" ? prev.bankAccount : "",
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

    //end
    };


    const payConfirmHandler = (paymentInfo) =>{
        console.log("payConfirmHandler",paymentInfo);
        //
        const payValid = validationPay(paymentInfo);
        console.log("payValid==========확인버튼 누르면 ", payValid);

        //카드 검증 true이면 띄우기
        console.log("payValid.valid",payValid.valid);
        if(!payValid.valid) {

            openModal({
                modalType: "error",
                content:<>
                    <p>{payValid.message}</p>
                </>,
                onConfirm: () => closeModal(),
            })

        }else{
            //검증 속성 true로 변경 ==> 결제완료
            setPaymentInfo((prev) => ({
                ...prev,
               payConfirm: true,
            }));
            //결제완료되면  결제완료 모달띄우기 ( 카드결제일경우, 계좌이체일경우 분기처리 필요
            openModal({
                modalType:"confirm",
                content:<>
                    {paymentInfo.payMethod === "card" ? 
                        (<p><span className="fw-bold me-2 d-inline-block text-primary">[카드번호]</span>확인완료.</p>)
                        : (<p><span className="fw-bold me-2 d-inline-block text-primary">[계좌번호]</span>확인완료.</p>)
                    }
                </>,
                onConfirm: () => {closeModal()}
            });

        }
    }


    return (
        <>
            <fieldset>
                <legend className="title my-3 clearfix">결제 수단 선택</legend>
                <p className="d-flex align-items-center justify-content-end mb-3"><span className="icon info me-3"></span>' - ' 를 제외하고 입력해주세요</p>
                <ul className="border border-dark-subtle p-4 bg-white bg-opacity-50 rounded-1 clearfix">
                    <li className="mb-3">
                        <input type="radio" id="card" name="payMethod" value="card"
                               checked={paymentInfo.payMethod === 'card'}
                               onChange={onChangePayMethod}/>
                        <label htmlFor="card" className="title mx-2 my-2">신용/체크카드</label>

                        {/* 신용카드 체크하면 */}
                        {paymentInfo.payMethod === 'card' && (
                            <div className="">
                                <div className="me-2 d-inline-flex align-items-center">
                                    <label htmlFor="cardName" className="title ms-4 me-3">카드사 선택</label>
                                    <select
                                        id="cardName"
                                        className="form-select w-auto"
                                        name="cardName"
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
                                    <button type="button" className="ms-2 btn btn-primary"
                                            onClick={() => payConfirmHandler(paymentInfo)}>확인
                                    </button>
                                </div>
                            </div>
                        )}
                    </li>
                    <li>
                        <input type="radio" id="bank" name="payMethod" value="bank"
                               checked={paymentInfo.payMethod === 'bank'}
                               onChange={onChangePayMethod}/>
                        <label htmlFor="card" className="title mx-2 my-2">계좌이체</label>
                        {/* 계좌이체 체크하면 */}
                        {paymentInfo.payMethod === 'bank' && (
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
                                    <button type="button" className="ms-2 btn btn-primary"
                                            onClick={() => payConfirmHandler(paymentInfo)}>확인
                                    </button>
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