import React from "react";
import axios from "axios";

const CancelPaymentBtn = ({bookId,payId,setPaymetInfo})=>{



    const handleCancel = async(bookId,payId) =>{

        //컨트롤러로 전달할 필수 데이터는 payId와 payId에 해당하는 bookId들
        const params = {
            payId: payId,
            bookId: bookId,
        }
        //결제취소 컨트롤러로 비동기 요청보내기
        try{
            const response = await axios.post("/api/mypage/payCancel",params);
            const recievedData = response.data;

            //결제 취소처리 데이터를 받으면, 최종 paymentInfo가 갱신이 되고, 리렌더링 되어야함 => useEffect 처리해야하는가?
            setPaymetInfo(recievedData);

        }catch(e){
            //에러처리
            console.error(e);
        }

    }


    return (
        <>
            <div className="text-center">
                <button className="btn btn-danger" onClick={()=>handleCancel(bookId,payId)}>
                    결제취소
                </button>
            </div>
        </>
    )
}

export default CancelPaymentBtn;